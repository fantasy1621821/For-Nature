const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const profile = {
  accessKeyId: "AKIAWFH2YKG7AJMN5NPX",
  secretAccessKey: "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",
  region: "ap-northeast-1",
};
AWS.config.update(profile);
const docClient = new AWS.DynamoDB.DocumentClient();


app.get('/', (req, res) => {
  res.send("Welcome to For Future APIs")
});
app.get('/getAllAuthor', (req, res) => {
  let table = "author";
  let param = {
    TableName: table,
  };
  docClient.scan(param, (err, data) => {
    if (err) {
      res.send("ERROR");
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.send(data);
    }
  })
});
app.get('/getAllLayer', (req, res) => {
  let table = "layer";
  let param = {
    TableName: table,
  };
  docClient.scan(param, (err, data) => {
    if (err) {
      res.send("ERROR");
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.send(data.Items);
    }
  })
});
app.get('/getAllStory', (req, res) => {
  let table = "story";
  let param = {
    TableName: table,
  };
  docClient.scan(param, (err, data) => {
    if (err) {
      res.send("ERROR");
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.send(data.Items);
    }
  })
});
app.post('/getAuthorWork', function (req, res) {
  let name = req.body.name;
  let table = "works";
  let param = {
    TableName: table,
    FilterExpression: "#at = :name",
    ExpressionAttributeNames: {
      "#at": "author",
    },
    ExpressionAttributeValues: {
      ":name": name,
    }
  };
  docClient.scan(param, (err, data) => {
    if (err) {
      res.send("ERROR");
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.send(data);
    }
  })
})
app.post('/getAuthor', function (req, res) {
  let name = req.body.name;
  let table = "author";
  let param = {
    TableName: table,
    FilterExpression: "#nm = :name",
    ExpressionAttributeNames: {
      "#nm": "name",
    },
    ExpressionAttributeValues: {
      ":name": name,
    }
  };
  docClient.scan(param, (err, data) => {
    if (err) {
      res.send("ERROR");
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.send(data);
    }
  })
})
app.get('/getAuthorList', function (req, res) {
  let table = "author";
  let result = [];
  let param = {
    TableName: table,
  };
  docClient.scan(param, (err, data) => {
    if (err) {
      res.send("ERROR");
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      for (let i = 0; i < data.Items.length; i++) {
        result.push(data.Items[i].name)
      }
      res.send(result);
    }
  })
});
app.post('/getStory', function (req, res) {
  let name = req.body.name;
  let title = req.body.title;
  let table = "story";
  let param = {
    TableName: table,
    FilterExpression: "#nm = :name and #tt = :title",
    ExpressionAttributeNames: {
      "#nm": "name",
      "#tt": "title"
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":title": title,
    }
  };
  docClient.scan(param, (err, data) => {
    if (err) {
      res.send("ERROR");
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.send(data);
    }
  })
});
app.post('/updateProfileData', function (req, res) {

  let table = "author";
  let name = req.body.name;
  let params = {
    TableName: table,
    Key: {
      "name": name,
    },
    UpdateExpression: "set birthday = :b, description = :d, imgSRC = :i, locate = :l, sex = :s, tag = :t",
    ExpressionAttributeValues: {
      ":b": req.body.birthday,
      ":d": req.body.description,
      ":i": req.body.imgSRC,
      ":l": req.body.locate,
      ":s": req.body.sex,
      ":t": req.body.tag,
    }
  };
  docClient.update(params, function (err, data) {
    if (err) {
      console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      res.send([false, "資料傳送過程發生錯誤，請再試一次或聯絡管理員"])
    } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      res.send([true, "資料編輯成功！"])
    }
  });
})
app.post('/uploadProfileData', function (req, res) {
  if (checkIsAvailable(req.body.name)) {
    let data = req.body;
    let table = "author";
    let params = {
      TableName: table,
      Item: data
    };
    docClient.put(params, function (err, data) {
      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        res.send([false, "新增資料失敗，請再試一次"])
      } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        res.send([true, "新增資料成功"])
      }
    });
  } else
    res.send([false, "新增資料失敗，出現相同名稱的作者"])

  function checkIsAvailable(name) {
    let table = "author";
    let param = {
      TableName: table,
      FilterExpression: "#nm = :name",
      ExpressionAttributeNames: {
        "#nm": "name",
      },
      ExpressionAttributeValues: {
        ":name": name,
      }
    };
    docClient.scan(param, (err, data) => {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        if (data.Items.length === 0) {
          return true
        } else return false
      }
    })
  }
});
app.post('/uploadStoryData', function (req, res) {
  let table = "story";
  let params = {
    TableName : table,
    KeyConditionExpression: "#tt = :title",
    ExpressionAttributeNames:{
      "#tt": "title"
    },
    ExpressionAttributeValues: {
      ":title": (req.body.author+"_"+req.body.title)
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.send([false,"程式發生錯誤，請聯絡管理員"])
    } else {
      if(data.Items.length!==0){
        res.send([false,"此作者已有同樣名稱的故事"])
      }else {
        let params2 = {
          TableName:table,
          Item:{
            "title":(req.body.author+"_"+req.body.title),
            "name":req.body.author,
            "content":req.body.content
          }
        };
        docClient.put(params2, function(err, data) {
          if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            res.send([false,"程式發生錯誤，請聯絡管理員"])
          } else {
            let TITLE=(req.body.author+"_"+req.body.title);
            let params3 = {
              TableName:"author",
              Key:{
                "name": req.body.author,
              },
              UpdateExpression: "SET #st =  list_append(#st , :data)",
              ExpressionAttributeNames:{
                "#st":"story",
              },
              ExpressionAttributeValues: {
                ":data": [TITLE],
              },
            };
            docClient.update(params3, function(err, data) {
              if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                res.send([false,"程式發生錯誤，請聯絡管理員"])
              } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                res.send([true,"建立成功！"])
              }
            });


          }
        });

      }
    }
  });
});
app.post('/updateStoryData', function (req, res) {
  let table = "story";
  let title = req.body.title;
  let name = req.body.name;
  let content = req.body.content;
  let params = {
    TableName:table,
    Key:{
      "title": title
    },
    UpdateExpression: "set content =:ct",
    ExpressionAttributeValues:{
      ":ct":{GIS:content.GIS,story:content.story},
    },
  };
  docClient.update(params, function(err, data) {
    if (err) {
      console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      res.send([false,"更新資料失敗，請聯絡管理者"])
    } else {
      res.send([true,"更新成功"])
    }
  });
});
app.post('/delProfileData', function (req, res) {
  let table = "author";
  let name = req.body.name;
  let params = {
    TableName: table,
    Key: {
      "name": name,
    },
    // ConditionExpression: "name = :nm",
    // ExpressionAttributeValues: {
    //   ":nm": name
    // }
  };
  docClient.delete(params, function (err, data) {
    if (err) {
      console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      res.send([false, "刪除失敗"])
    } else {
      console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
      res.send([true, "刪除成功！"])
    }
  });
})
app.post('/delStoryData', function (req, res) {
  let title = req.body.title;
  let name = req.body.name;
  let id = req.body.id;
  let tableStory="story";
  let tableAuthor="author";
  let params = {
    TableName:tableStory,
    Key:{
      "title": title
    },
  };
  docClient.delete(params, function(err, data) {
    if (err) {
      console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      res.send([false,"刪除失敗，請聯絡管理員"])
    } else {
      let params2 = {
        TableName:tableAuthor,
        Key:{
          "name": name,
        },
        UpdateExpression: "REMOVE story["+id+"]",
        ReturnValues:"UPDATED_NEW"
      };

      console.log("Attempting a conditional update...");
      docClient.update(params2, function(err, data) {
        if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
          res.send([false,"刪除失敗，請聯絡管理員"])
        } else {
          res.send([true,"刪除成功！"])
        }
      });
    }
  });



});

app.get('/addAccount', function (req, res) {
  let table = "accounts";
  let username = "lisa870405a@gmail.com";

  var params = {
    TableName: table,
    Item: {
      "username": username,
      "password":encryptPWD("a26328786")
    }
  };

  console.log("Adding a new item...");
  docClient.put(params, function (err, data) {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
      res.send("OK");
    }
  });
})
app.post('/login', function (req, res) {
  let mail = req.body.mail;
  let password = req.body.password;
  let table = "accounts";
  let isLogin = false;
  password = encryptPWD(password);
  let params = {
    TableName: table,
    Key: {
      "username": mail,
    }
  };
  let promiseData = docClient.get(params).promise();
  promiseData
    .then(function (data) {
      if (data.Item.password === password) {
        req.session.auth = data.Item.auth;
        isLogin = true;
      }
    })
    .then(function () {
      if (isLogin) {
        res.send("now login")
      } else {
        res.send("oops");
      }
    })
    .catch(function (err) {
      res.send("oops");
    })

});
app.post('/logout', function (req, res) {
  delete req.session.auth;
  res.send("0")
});
app.get('/isLogin', function (req, res, next) {
  if (!req.session.auth) {
    res.redirect('/')
  } else {
    next()
  }
}, function (req, res, next) {
  res.send("now login")
})
module.exports = {
  path: '/api',
  handler: app
}


function encryptPWD(password) {
  let SHA3 = require('sha3');
  let saltPassword = password + "1z@12..\|Q_@[]aZXzxcj109231asasd.zxcm";
  return new SHA3.SHA3Hash().update(saltPassword).digest('hex')
}
