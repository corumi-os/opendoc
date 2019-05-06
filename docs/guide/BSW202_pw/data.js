       var single = {
            static: { name: '待机1小时', val: 0.14 },
            vibra: { name: '震动1秒', val: 35 / 3600 },
            screen: { name: '亮屏1秒', val: 5 / 3600 },
            HR: { name: '心率测量1分钟', val: 1.8 / 60 },
        };  // 单位能耗(mAh)
        var user_option = {
            battery : { name: '电池容量', cnt:100*0.72 },
            msg_cnt : { name: '消息提醒次数', cnt:50,min:10,max:100 },
            msg_vt : {name:'消息振动时长', cnt:0.4},
            call_cnt : { name: '电话提醒次数', cnt:24,min:6,max:60 },
            call_vt : {name:'电话振动时长', cnt:5*0.4},

            screen_cnt : { name: '亮屏次数', cnt: 150,min:80,max:300 },
            screen_time : { name: '每次亮屏时间(sec)', cnt:10 },
            HR_cnt : { name: '心率测量次数', cnt:64,min:48,max:144 },
        };
        var user_pwr = {
            msg : user_option.msg_cnt.cnt * user_option.msg_vt.cnt,
            call : user_option.call_cnt.cnt * user_option.call_vt.cnt,
            screen : user_option.screen_cnt.cnt * user_option.screen_time.cnt,
            HR : user_option.HR_cnt.cnt
        }
        function get_pwr_p(v,p){
            return Number(((v.max - v.min) * p + v.min).toFixed(0))
        };
        var get_user_pwr=function(p){
            p = Number(p.toFixed(2))
            var msg = get_pwr_p(user_option.msg_cnt, p)
            var call = get_pwr_p(user_option.call_cnt, p)
            var scr = get_pwr_p(user_option.screen_cnt, p)
            var HR = get_pwr_p(user_option.HR_cnt, p)
            var static = Number((single.static.val * 24).toFixed(2))
            // return { p: p, sum: sum, static: static, msg: msg, call: call, scr: scr, HR: HR };
            return [{ p: p, type:'static', alia: '静态功耗', name: '静态', unit: 'mAh',cnt: static,val: static},
            { p: p, type: 'msg',alia:'消息', name: '消息',cnt: msg,unit:'次',val: Number((msg * user_option.msg_vt.cnt * single.vibra.val).toFixed(2))}, 
            { p: p, type: 'call', alia: '电话', name: '电话', cnt: call, unit: '次',val: Number((call * user_option.call_vt.cnt * single.vibra.val).toFixed(2))}, 
            { p: p, type: 'scr', alia: '屏幕点亮', name: '屏幕', cnt: scr, unit: '次',val: Number((scr * user_option.screen_time.cnt * single.screen.val).toFixed(2))}, 
            { p: p, type: 'HR', alia: '心率测量', name: '心率', cnt: HR, unit: '次',val: Number((HR * single.HR.val).toFixed(2))}];
        };
        var get_user_dur = function (p1, p2, p3) {
            // p1 = Number(p1.toFixed(2))
            // p2 = Number(p2.toFixed(2))
            // p3 = Number(p3.toFixed(2))
            var msg = get_pwr_p(user_option.msg_cnt, p1)
            var call = get_pwr_p(user_option.call_cnt, p1)
            var scr = get_pwr_p(user_option.screen_cnt, p2)
            var HR = get_pwr_p(user_option.HR_cnt, p3)
            var static = Number((single.static.val * 24).toFixed(2))
            var pwr = static
                + msg * user_option.msg_vt.cnt * single.vibra.val
                + call * user_option.call_vt.cnt * single.vibra.val
                + scr * user_option.screen_time.cnt * single.screen.val
                + HR * single.HR.val
            return Number((user_option.battery.cnt / pwr).toFixed(2))
        };
        var get_user_pwr_sum = function (p) {
            p = Number(p.toFixed(2))
            var msg = get_pwr_p(user_option.msg_cnt, p)
            var call = get_pwr_p(user_option.call_cnt, p)
            var scr = get_pwr_p(user_option.screen_cnt, p)
            var HR = get_pwr_p(user_option.HR_cnt, p)
            var static = Number((single.static.val * 24).toFixed(2))
            var sum = static
                + Number((msg * user_option.msg_vt.cnt * single.vibra.val).toFixed(2))
                + Number((call * user_option.call_vt.cnt * single.vibra.val).toFixed(2))
                + Number((scr * user_option.screen_time.cnt * single.screen.val).toFixed(2))
                + Number((HR * single.HR.val).toFixed(2));
            return {p:p,val:sum}
        }
        // alert(JSON.stringify(user_option))

        // pwr_daily = [
        //     { name: '待机', alia: '待机', consumption: Number((single.static.val*24).toFixed(3)) },
        //     { name: '消息', alia: '消息', consumption: Number((single.vibra.val* user_pwr.msg).toFixed(3)) },
        //     { name: '电话', alia: '电话', consumption: Number((single.vibra.val* user_pwr.call).toFixed(3)) },
        //     { name: '屏幕', alia: '屏幕', consumption: Number((single.screen.val* user_pwr.screen).toFixed(3)) },
        //     { name: '心率', alia: '心率', consumption: Number((single.HR.val* user_pwr.HR).toFixed(3)) },
        // ];  // 每日功耗(mAh)
        pwr_daily = get_user_pwr(0.5)
        var pwr_sum=0
        pwr_daily.forEach(v => {
            pwr_sum+=v.val
        });
        pwr_scan = [];
        for (let index = 0; index < 21; index++) {
            get_user_pwr(index * 0.05).forEach(v => {
                pwr_scan.push(v)
            });
        }
        bat_dur = [];
        for (let index = 0; index < 21; index++) {
            bat_dur.push(get_user_pwr_sum(index * 0.05))
            bat_dur[index].cnt = Number((user_option.battery.cnt / bat_dur[index].val).toFixed(1))
            bat_dur[index].alia = '待机天数'
            bat_dur[index].unit = '天'
        }
        detail_dur = [];
        const detail = 6;
        for (let notify = 0; notify < detail; notify++) {
            for (let scr = 0; scr < detail; scr++) {
                for (let hr = 0; hr < detail; hr++) {
                    detail_dur.push({ notify: get_pwr_p(user_option.msg_cnt, notify/detail)+get_pwr_p(user_option.call_cnt, notify*0.1),
                        scr: get_pwr_p(user_option.screen_cnt, scr/detail),
                        hr: get_pwr_p(user_option.HR_cnt, hr/detail),
                        dur: get_user_dur(notify/detail,scr/detail,hr/detail)})
                }
            }
        }
        // console.log(JSON.stringify(detail_dur))

        // alert(pwr_scan.toSource())
        // 基础-蓝牙-走针
        // 交互-提醒-屏幕
        // 传感-加速度-心率
