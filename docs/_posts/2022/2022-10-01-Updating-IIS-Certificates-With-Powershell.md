---
date:   2022-01-10
category: technical
tags: powershell iis certificates 
title: Updating IIS certificates with powershell
cover-img: /images/cert.png
thumbnail-img: /images/cert-small.png
readtime: true
hidden: false
share-description: Let's say you needed to update your SSL certificates on IIS, across a whole lot of servers. Do you want to do it all manually? Heck no.
excerpt: Let's say you needed to update your SSL certificates on IIS, across a whole lot of servers. Do you want to do it all manually? Heck no. Let's hack something together in powershell to make it work. The method binding.AddSslCertificate() is the one you're looking for!
---

Let's say you were in a situation where you had to update a certificate that was installed on a lot of servers. Do you want to do it all manually? Heck no. Let's hack together some powershell to make it work.

### Importing the certificate locally

Let's get it working locally first. Within a powershell window, let's try a few commands. First off, let's load in our new certificate that we want to install. Assuming that we have a certificate in `pfx` format that is ready to be imported, let's install it into our certificate store:

```powershell
$certname = "c:\my-certificate.pfx"
$certpwd = "certificate-install-password"

$pfxpass = $certpwd |ConvertTo-SecureString -AsPlainText -Force

$newCert = Import-PfxCertificate -FilePath $certname `
    -CertStoreLocation "Cert:\LocalMachine\My" `
    -password $pfxpass
```

Your new certificate should be installed and viewiable in IIS by clicking on your computer name (not on one of the sites!) and then choosing "Server Certificates", and you should see something like this:

![certificate showing in IIS](/images/cert-in-iis.png){:class="img-responsive"}

Great! 

### Updating IIS to use the new certificate

Now how about we update one particular binding to use this new certificate:

```powershell
# load in the admin scripts for doing stuff with IIS:
Import-Module Webadministration

# fetch the default web site:
$site = Get-ChildItem -Path "IIS:\Sites" | where {( $_.Name -eq "Default Web Site" )}
```

You might want to check that your `$site` variable has the right web site before you proceed. Just run `echo $site` and it should be pretty obvious.

Now let's fetch the first SSL binding that is mapped to port 443:

```powershell

$binding = $site.Bindings.Collection | `
    where {( $_.protocol -eq 'https' -and $_.bindingInformation -eq '*:443:')}

 ```

and let's do the magic:

```powershell

$binding.AddSslCertificate($newCert.Thumbprint, "my")

```

BTW, this `AddSslCertificate` command doesn't seem to be documented anywhere, and in my opinion it's confusingly named - if there's already an SSL certificate assigned to the binding then it will *update* it to use the new one. But hey, it works: 

![certificate updated IIS binding](/images/cert-binding-updated.png){:class="img-responsive"}

Woo! 

Now this is all well and good, but how do we do this across multiple servers, remotely?

## Installing certs on multiple servers

Let's copy the cert to a few servers:

```powershell
$servers = @('server1','server2','server3')
$servers | foreach-Object { copy-item -Path $certname -Destination "\\$_\c`$" }
```

This will copy the cert into the `c:\` drive on the desired servers. Note the extra confusing use of the tilde character which you have to use in powershell to escape a dollar sign in a string! 

Now let's connect to all of these servers and import the certificate:

```powershell
# Establish a connection to all of those servers:
$session = New-PsSession -ComputerName $servers

$importCertificatesCommand = ({
    Import-Module Webadministration

    $newCert = Import-PfxCertificate `
      -FilePath "c:\$($using:certname)"  `
      -CertStoreLocation "Cert:\LocalMachine\My" `
      -password $using:pfxpass
})

Invoke-Command -session $session -scriptblock $importCertificatesCommand
```

There's a bunch of magic here. `New-PsSession` creates a new connection to a remote server, for the supplied list of server names. `Invoke-Command` executes the desired command against all of the servers that we've opened a connection to, and then we are adding the `$using` prefix to any variables that we wish to access outside of this command. 

Once that's done, we can delete the certificate off the servers:

```powershell
Invoke-command -Session $session { remove-item -path "c:\$($using:certname)" }
```

Things are starting to look good! We have the cert imported, shall we update IIS to use this new certificate across all our servers, if they are using an older certificate that we know is about to expire? Let's update our command:

```powershell
$importCertificatesCommand = ({

    $newCert = Import-PfxCertificate `
      -FilePath "c:\$($using:certname)"  `
      -CertStoreLocation "Cert:\LocalMachine\My" `
      -password $using:pfxpass

    Import-Module Webadministration

    $sites = Get-ChildItem -Path IIS:\Sites

    foreach ($site in $sites)
    {
        foreach ($binding in $site.Bindings.Collection)
        {
            if ($binding.protocol -eq 'https')
            {
                $search = "Cert:\LocalMachine\My\$($binding.certificateHash)"
                $certs = Get-ChildItem -path $search -Recurse
                $hostname = hostname
                
                if (($certs.count -gt 0) -and 
                    ($certs[0].Subject.StartsWith("CN=MyOldCertificate")))
                {
                    echo "Updating $hostname, site: `"$($site.name)`", binding: `"$($binding.bindingInformation)`", current cert: `"$($certs[0].Subject)`", Expiry Date: `"$($certs[0].NotAfter)`""

                    $binding.AddSslCertificate($newCert.Thumbprint, "my")
                }
            }
        }
    }
})
```

With a bit of luck, you should see something like this:

![output from script](/images/cert-output.png){:class="img-responsive"}

