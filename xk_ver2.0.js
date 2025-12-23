//设置请求间隔(ms)
const setRequestTimeInterval = 1000;
//设置请求次数
const RequestTimes = 1;

function getLessonIds(){
    let lessonIds = '';
    const iframe = document.querySelector('.iframe-inner.iframe-inner-2-0');
    const iframeDoc = iframe.contentDocument;
    // console.log(iframeDoc);
    const lessonsDiv = iframeDoc.querySelector('.ui-jqgrid-bdiv');
    // console.log(lessonsDiv);
    const rows = lessonsDiv.querySelectorAll('tr');
    for(let i=1;i<rows.length;i++)
    {
        if(rows[i].getAttribute('aria-selected')==='true')
        {
            if(lessonIds)
            {
                lessonIds = lessonIds + ',' + rows[i].getAttribute('id');
            }else{
                lessonIds = rows[i].getAttribute('id');
            }
        }
    }
    console.log(lessonIds);
    return lessonIds;
}

function sendRequest(ids) {
    const url = 'https://jwzf.scau.edu.cn/jwglxt/xsxk/zzxkyzbjk_xkBcZyZzxkYzbFromCart.html?gnmkdm=N253512';
    
    const formData = new URLSearchParams();
    formData.append('ids', ids);

    const headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Origin': 'https://jwzf.scau.edu.cn',
        'Referer': 'https://jwzf.scau.edu.cn/jwglxt/xsxk/zzxkyzb_cxZzxkYzbIndex.html?gnmkdm=N253512&layout=default',
        'X-Requested-With': 'XMLHttpRequest'
    };

    const options = {
        method: 'POST',
        headers: headers,
        body: formData.toString(),
        credentials: 'include'
    };

    let flagCnt = 0;
    let dataLength;

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            dataLength = data.length;
            
            data.forEach(element => {
                if(element.flag==0)
                {
                    console.log("flag=0");
                    console.log(`失败原因：${element.msg}`);
                    //throw new Error('flag=0');
                }else
                {
                    flagCnt++;
                    console.log(`flag=${element.flag}`);
                    console.log(`sum of flag is ${flagCnt}`);
                }
            });
        })
        .then(() =>{
            if(flagCnt==0)
            {
                console.log("选课全部失败");
            }else if(flagCnt==dataLength)
            {
                for(let i=0;i<666;i++)
                {
                console.log(`选课成功!    Conguaduation!\n\n\n\n\n\n`);
                }
            }else
            {
                console.log(`部分选课成功，共选上 ${flagCnt} 门课程`);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });


}


function start() {
    let lessonIds = getLessonIds();
    if(lessonIds=='')
    {
        alert('未选中课程');
        return 114514;
    }
    let count = 0;
    const interval = setInterval(() => {
        sendRequest(lessonIds);
        count++;
        console.log(`已提交 ${count} 次`);
        
        if (count >= RequestTimes) {
            clearInterval(interval);
            console.log(`已完成 ${RequestTimes} 次请求`);
        }

    }, setRequestTimeInterval);
    return interval; 
}

const timer = start();

// 要停止时执行
// clearInterval(timer);