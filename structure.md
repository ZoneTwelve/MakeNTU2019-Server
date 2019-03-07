# smart parker
``` API
service:
 - index
 - api:
   - update:['POST']:{
       id:INT
       name:STRING,
       position:[FLOAT, FLOAT],
       space:[
         pid:INT,
         status:BOOLEAN,
         detail:{
           layer:STRING
           price:INT
           ...
         }
       ]
     }
   - status:[
      {
        id:INT
        name:STRING,
        position:[FLOAT, FLOAT],
        space:[
        pid:INT,
        status:BOOLEAN,
        detail:{
          layer:STRING
          price:INT
          ...
        }
      }
   ]
```

https://hackmd.io/9XWTI-NCSI-4LihV_Ys4fA#