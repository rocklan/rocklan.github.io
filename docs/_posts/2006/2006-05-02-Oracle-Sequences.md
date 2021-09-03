---
date: 2006-05-02
category: technical
readtime: true
---
<h3>Updating sequences that might be dodgy</h3>

<p>If you've copied data from another schema into a table of yours, you might have the problem where the sequence that you're using for your Primary Key is now invalid. Here's how to troubleshoot the problem, an example set of data, and some example Java code to fix it.</p>

<h4>Example</h4>
<p>Let's say we have a table named TBL1:</p><pre>
  select * from TBL1
 
      TBL_ID         DESCRIPTION
      -----------    ---------------------
      1              example item
      2              another item


  select TBL_ID_SEQ.nextval as val from DUAL
  
            VAL
      ---------
              3
</pre><p>Everything is currently good. However if we want to copy a few items from another database, we're going to end up with the following:</p><pre>
    select * from TBL1

        TBL_ID         DESCRIPTION
        -----------    ---------------------
        1              example item
        2              another item
        100            production item
        101            production item2


    select TBL_ID_SEQ.nextval as val from DUAL

        VAL
        -----------    
        3
</pre><p>Eventually, after we have inserted 97 more ITEMs, we're going to get an error when we try to insert another ITEM with a Primary Key of 100. So what we need to do is update our sequence to 102. First off, to see if the sequences ok, we can do two statements:</p><pre>
    select TBL_ID_seq.nextval from dual;
    select max(TBL_ID) from TBL1;
</pre><p>Which gives us the following:</p><pre>
            NEXTVAL
        -----------
                  3

    MAX(TBL_ID)
   -----------------
                 101
</pre><p>To update the sequence, we need to do the following:</p><pre>
    select 101 - 3 from dual
    
                101-3
    -----------------
                   98

    1 row selected.
</pre><p>Then use this number to update the increment of the sequence:</p><pre>    alter sequence TBL_ID_seq increment by 98
</pre><p>then select from the sequence to increment it:</p><pre>    select TBL_ID_seq.nextval from dual
</pre><p>then set the sequence back to increment by 1:</p><pre>    alter sequence TBL_ID_seq increment by 1
</pre><p>Now you're done! You'll notice that our sequence number is  now to set to 101. Next time we do a select TBL_ID_SEQ.nextval, it'll be 102, which is exactly what we want.</p><h3>Java code</h3>
<p>Here's some Java code for you to update three separate sequences. To run it you'll have to stick it into your own Java class and setup the database connection. (There's also not a lot of error handling.)</p>

```java
/** Function to execute some specified SQL */
private void runSql(String sql) throws SQLException
{
    PreparedStatement pstmt = con.prepareStatement(sql);
    pstmt.execute();
    pstmt.close();
}

/** Function to fetch one int from the DB */
private int runSqlGetNumber(String sql) throws SQLException
{
    int i;
    PreparedStatement pstmt = con.prepareStatement(sql);
    ResultSet rsCount = pstmt.executeQuery();
    rsCount.next();
    i = rsCount.getInt("c");
    rsCount.close();
    pstmt.close();
    return i;
}

function updateSequences() throws SQLException
{
    con = getConnection();
    int maxID2, maxID;
    int currentID2, currentID;
    
    maxID2 = runSqlGetNumber("select max(TBL2_ID) as c from TBL2");
    maxID = runSqlGetNumber("select max(TBL_ID) as c from TBL1");

    currentID2 = runSqlGetNumber("select TBL2_ID_SEQ.nextval as c from dual");
    currentID = runSqlGetNumber("select TBL_ID_SEQ.nextval as c from dual");

    if (currentID2 <= maxID2)
    {
        runSql("alter sequence TBL2_ID_SEQ increment by " + (maxID2 - currentID2));
        runSql("select TBL2_ID_SEQ.nextval from dual");
        runSql("alter sequence TBL2_ID_SEQ increment by 1");
    }

    if (currentID <= maxID)
    {
        runSql("alter sequence TBL_ID_SEQ increment by " + (maxID - currentID));
        runSql("select TBL_ID_SEQ.nextval from dual");
        runSql("alter sequence TBL_ID_SEQ increment by 1");
    }

    con.close();
}
```