const container = document.createElement("div");
container.id = "my-extension-container";
container.style.cssText = `
  position: fixed;
  top: 0px;
  right: 200px;
  z-index: 999999;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
  width: 250px;
`;

const executeTime = document.createElement("p");
executeTime.style.cssText = `
  display:none;
`;

const input = document.createElement("input");
input.type = "number";
input.placeholder = "持续时间(s)";
input.style.cssText = `
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const executeButton = document.createElement("button");
executeButton.textContent = "开始选课";
executeButton.style.cssText = `
  width: 100%;
  padding: 10px;
  background: #2D9DE5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
`;

container.appendChild(input);
container.appendChild(executeButton);
container.appendChild(executeTime);
document.body.appendChild(container);

let running=false

executeButton.addEventListener("click", async () => {
  if(!running){
    executeButton.textContent = "提前终止";
  }else{
    executeButton.textContent = "开始选课";
    console.log(intervalId);
    clearInterval(intervalId);
  }
  running=!running
  const number = input.value.trim();
  new Promise(async (resolve, reject) => {
    if(running){
    await start(number);
    }
    resolve();
  }).then(() => {
    const iframe = document.querySelector(".iframe-inner.iframe-inner-2-0");
    const iframeDoc = iframe.contentDocument;
    const btn = iframeDoc.getElementById("btn_success");
    console.log(btn);
    btn.click();
  }).catch((error)=>{
    console.error(error);
  }).finally(()=>{
    executeButton.textContent = "开始选课";
    running=false
  })
});

function start(time) {
  return new Promise((resolve, reject) => {
    if (!time) {
      alert("未设置时间");
      reject()
      return null;
    }
    const RequestTimes = time * 10;
    const setRequestTimeInterval = 100;
    let lessonIds = getLessonIds();
    if (!lessonIds) {
      alert("未选中课程");
      reject()
      return null;
    }
    let count = 0;
    executeTime.style.cssText = `
  display:contents;
`;

    const interval = setInterval(() => {
      sendRequest(lessonIds);
      count++;
      time=count*0.1;
      executeTime.textContent = `已执行${time.toFixed(1)}s`;
      console.log(`已执行${time.toFixed(1)}s`)
      console.log(`已提交 ${count} 次`);

      if (count >= RequestTimes) {
        clearInterval(interval);
        resolve();
        //console.log(`已完成 ${RequestTimes} 次请求`);
      }
    }, setRequestTimeInterval);

    intervalId=interval
  });
}
let intervalId;
// 要停止时执行
// clearInterval(timer);

function getLessonIds() {
  let lessonIds = "";
  if (!document.querySelector(".iframe-inner.iframe-inner-2-0")) {
    console.error("找不到网页");
    return lessonIds
  }
  const iframe = document.querySelector(".iframe-inner.iframe-inner-2-0");
  const iframeDoc = iframe.contentDocument;
  // console.log(iframeDoc);
  const lessonsDiv = iframeDoc.querySelector(".ui-jqgrid-bdiv");
  // console.log(lessonsDiv);
  const rows = lessonsDiv.querySelectorAll("tr");
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].getAttribute("aria-selected") === "true") {
      if (lessonIds) {
        lessonIds = lessonIds + "," + rows[i].getAttribute("id");
      } else {
        lessonIds = rows[i].getAttribute("id");
      }
    }
  }
  console.log(lessonIds);
  return lessonIds;
}

function sendRequest(ids) {
  const url =
    "https://jwzf.scau.edu.cn/jwglxt/xsxk/zzxkyzbjk_xkBcZyZzxkYzbFromCart.html?gnmkdm=N253512";

  const formData = new URLSearchParams();
  formData.append("ids", ids);

  const headers = {
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    Origin: "https://jwzf.scau.edu.cn",
    Referer:
      "https://jwzf.scau.edu.cn/jwglxt/xsxk/zzxkyzb_cxZzxkYzbIndex.html?gnmkdm=N253512&layout=default",
    "X-Requested-With": "XMLHttpRequest",
  };

  const options = {
    method: "POST",
    headers: headers,
    body: formData.toString(),
    credentials: "include",
  };
  // let flagCnt = 0;
  // let dataLength;
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      alert(error);
    });
  // .then((data) => {
  //   dataLength = data.length;

  //   data.forEach((element) => {
  //     if (element.flag == 0) {
  //       console.log("flag=0");
  //       console.log(`失败原因：${element.msg}`);
  //       //throw new Error('flag=0');
  //     } else {
  //       flagCnt++;
  //       console.log(`flag=${element.flag}`);
  //       console.log(`sum of flag is ${flagCnt}`);
  //     }
  //   });
  // })
  // .then(() => {
  //   if (flagCnt == 0) {
  //     console.log("选课全部失败");
  //   } else if (flagCnt == dataLength) {
  //     for (let i = 0; i < 666; i++) {
  //       console.log(`选课成功!    Conguaduation!\n\n\n\n\n\n`);
  //     }
  //   } else {
  //     console.log(`部分选课成功，共选上 ${flagCnt} 门课程`);
  //   }
  // })
  // .catch((error) => {
  //   console.error("There was a problem with the fetch operation:", error);
  // });
}


