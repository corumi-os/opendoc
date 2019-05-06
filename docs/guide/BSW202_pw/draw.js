// Step 1: 创建 Chart 对象
const chart = new G2.Chart({
    theme: 'dark',
    // animate: false,
    container: 'c1', // 指定图表容器 ID
    width: 300, // 指定图表宽度
    height: 300, // 指定图表高度
    padding: [20, 20, 75, 40]
});
// Step 2: 载入数据源
$("#input2").change(function () {
    // pwr_daily[1].consumption = temp;
    // chart.source(pwr_daily);
    chart.repaint();
});
chart.source(pwr_daily);
    // chart.interval().position('name*consumption').color('name').label('consumption', { offset: 10 })
chart.interval().position('name*val').color('name').label('val', { offset: 10 })
chart.render();

const chart2 = new G2.Chart({
    theme: 'dark',
    animate: true,
    container: 'c2', // 指定图表容器 ID
    width: 300, // 指定图表宽度
    height: 300, // 指定图表高度
    padding: [20, 20, 55, 10]
});

chart2.coord('theta',{
        radius: 0.8, // 设置半径，值范围为 0 至 1
        innerRadius: 0.4, // 空心圆的半径，值范围为 0 至 1
        // startAngle: -1 * Math.PI / 2, // 极坐标的起始角度，单位为弧度
        // endAngle: 3 * Math.PI / 2 // 极坐标的结束角度，单位为弧度
    })
chart2.tooltip({
        showTitle: false // 不显示title
    });
chart2.source(pwr_daily);
chart2.intervalStack().position('val').color('name').label('val', {
        // offset: 10,
        autoRotate: false,
        formatter: function formatter(val, item) {
            return item._origin.alia + ': ' + ((val/pwr_sum)*100).toFixed(0)+'%';
        },
        textStyle: {
            textAlign: 'center',
            shadowBlur: 4,
            shadowColor: 'rgba(0, 0, 0, .45)'
        }
    })
chart2.render();

const chart3 = new G2.Chart({
    theme: 'dark',
    container: 'c3', // 指定图表容器 ID
    width: 642, // 指定图表宽度
    height: 400, // 指定图表高度
    padding: [20, 40, 65, 40],
});
var view1 = chart3.view()
view1.source(pwr_scan, {
    val: {
        tickInterval: 2
        },
    p:{
        // type: 'cat',
        // sync: true,
        // range: [1 / 20, 19 / 20],
    }
    });
view1.axis('val',{
    label:{offset:25}
})
// view1.legend('val',{
//         formatter: function formatter(val) {
//             return val + '%';
//         }
//     })
view1.intervalStack().position('p*val').color('alia').opacity(0.8)
// view1.tooltip(false)

var view2 = chart3.view()
view2.source(bat_dur,{
        p: {
            // type: 'identity',
            // sync: true,
            // range: [1/20, 19/20],
        },
        cnt:{
            min:0
        }})
view2.line().position('p*cnt').color('red').shape('smooth').size(2)
view2.point().position('p*cnt').color('red').label('cnt',{
    textStyle: {
        fill: 'red',
        fontWeight: 'bold',
    }
})
view2.axis('cnt', {
    position: 'right',
    grid:{ type: 'none',},
    label:{
        min: 0,
        offset:20,
        textStyle: {
            fill: 'red',
            fontWeight: 'bold',
        }
    },
});
// view2.tooltip(false)

chart3.tooltip({
    showTitle: false,
});
var items;
chart3.on('tooltip:change', function (ev) {
        var flag = false
        if (items && items[0].title == ev.items[0].title) {
            flag = true
        }
        items = ev.items;
        // console.log(JSON.stringify(items))
        items.forEach(v => {
            if (v.point._origin.alia) {
                v.name = v.point._origin.alia
                v.value = v.point._origin.cnt + v.point._origin.unit
            }
        });

        if(!flag){
            pwr_daily = get_user_pwr(parseFloat(items[0].title))
            // console.log(items[0].title)
            // console.log(parseFloat(items[0].title))
            pwr_sum = 0
            pwr_daily.forEach(v => {
                pwr_sum += v.val
            });

            chart.source(pwr_daily);
            chart2.source(pwr_daily);
            chart.repaint();
            chart2.repaint();
        }
    });
// chart3.on('plotclick', function (ev) {
//     alert('test')
// });
// chart3.select(
        // mode: 'single',
        // style: { fill: '#FF0000' }, // 选中后 shape 的样式
        // cancelable: false,
    // )
chart3.render()


const chart4 = new G2.Chart({
    theme: 'dark',
    container: 'c4', // 指定图表容器 ID
    forceFit: true,
    padding: [40, 40, 105, 40],
});
chart4.source(detail_dur, {
    notify: {
        type: 'linear',
        // min: -2,
        // max: 12,
        tickInterval: 10,
    },
    scr: {
        type: 'linear',
        // min: -2,
        // max: 12,
        tickInterval: 10,
    },
    hr: {
        type: 'linear',
        // min: -2,
        // max: 12,
        tickInterval: 10,
    },
})
chart4.tooltip({
    showTitle: false // 不显示默认标题
});
chart4.scale({
    notify: {
        min: 0,
        // max: 9.5,
        alias: '提醒震动次数'
    },
    scr: {
        min: 0,
        // max: 9.5,
        alias: '屏幕点亮次数'
    },
    hr: {
        min: 0,
        // max: 9.5,
        alias: '心率测量次数'
    },
    dur: {
        alias: '续航天数'
    }
});
// chart4.legend('notify', false);
// chart4.legend('scr', false);
chart4.legend('dur', { itemGap: 20});
chart4.point().position('hr*scr').color('dur').adjust('jitter').size('dur',[3,12]).shape('circle')
.tooltip('notify*scr*hr*dur')
chart4.axis('notify', {
    label: null,
    line: {
        lineWidth: 2,
        stroke: '#777'
    },
    grid: {
        type: 'line',
        lineStyle: {
            stroke: '#d9d9d9',
            lineWidth: 1,
            lineDash: [4, 4]
        },
    }
}).axis('scr', {
    label: null,
    line: {
        lineWidth: 2,
        stroke: '#777'
    },
    grid: {
        type: 'line',
        lineStyle: {
            stroke: '#d9d9d9',
            lineWidth: 1,
            lineDash: [4, 4]
        },
    }
})
chart4.render()
// size('notify', [4, 12]).
