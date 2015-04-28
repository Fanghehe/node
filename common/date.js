exports.calculateDate = function(oldDate){
    var timeInterval = (new Date()).getTime() - oldDate.getTime();
    var years = timeInterval / (365 * 24 * 3600 * 1000),
        months = timeInterval / (30 * 24 * 3600 * 1000),
        days = timeInterval / (24 * 3600 * 1000),
        hours = timeInterval / (3600 * 1000),
        minutes = timeInterval / (60 * 1000),
        seconds = timeInterval / (1000);
    if (Math.floor(years)) {
        return Math.round(years) + '年';
    } else if (Math.floor(months)){
        return Math.round(months) + '月';
    }else if (Math.floor(days)){
        return Math.round(days) + '日';
    }else if (Math.floor(hours)){
        return Math.round(hours) + '小时';
    }else if (Math.floor(minutes)){
        return Math.round(minutes) + '分';
    }else if (Math.floor(seconds)){
        return Math.round(seconds) + '秒';
    }
};
