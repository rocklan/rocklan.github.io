---
date: 2006-05-14
category: technical
readtime: true
---
<h2>Connecting to a database in Java</h2>
<p>It should be pretty easy right? Well it is, but difficult to troubleshoot. It will either work or won't, and you won't have a clue why not. So here's a skeleton program that you can use:</p><font color="blue"><pre><br />import java.sql.*;<br />import import oracle.jdbc.pool.OracleDataSource;<br /><br />public class DoDatabaseStuff<br />{<br />    public static void main(String[] args) throws Exception <br />    {<br />        // Put connection code here..<br />    }<br />}<br /></pre></font><h3>Mysql 5</h3>
<p>Make sure you put <b>mysql-connector-java-3.1.8-bin.jar</b> into your classpath when running.</p><font color="blue"><code><br />    Class.forName("com.mysql.jdbc.Driver").newInstance();<br />    Connection mysqlConn = DriverManager.getConnection("jdbc:mysql://localhost/DBNAME?user=root&password=WhateverYouEntered");<br />    mysqlConn.close();<br /></code></font><h3>Oracle 10g Express</h3>
<p>Make sure you put <b>ojdbc-14.jar</b> into your classpath when running. Oh yeah, and the syntax has changed a bit.</p><font color="blue"><code><br />OracleDataSource ds = new OracleDataSource();<br />ds.setURL("jdbc:oracle:thin:username/password@localhost:1521");<br />Connection conn2 = ds.getConnection();<br />conn2.close();<br /></code></font><p>Once you've got your connection you can then start executing SQL by using a PreparedStatement (look it up in the Java API's). Tommorow I'll post about how to set up your test data using DBUnit.</p><p>