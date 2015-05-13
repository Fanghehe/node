exports.calculateDate = function(oldDate){
    var timeInterval = (new Date()).getTime() - oldDate.getTime();
    var years = timeInterval / (365 * 24 * 3600 * 1000),
        months = timeInterval / (30 * 24 * 3600 * 1000),
        days = timeInterval / (24 * 3600 * 1000),
        hours = timeInterval / (3600 * 1000),
        minutes = timeInterval / (60 * 1000),
        seconds = timeInterval / (1000);
    if (Math.floor(years)) {
        return Math.floor(years) + '年';
    } else if (Math.floor(months)){
        return Math.floor(months) + '月';
    }else if (Math.floor(days)){
        return Math.floor(days) + '日';
    }else if (Math.floor(hours)){
        return Math.floor(hours) + '小时';
    }else if (Math.floor(minutes)){
        return Math.floor(minutes) + '分钟';
    }else if (Math.floor(seconds)){
        return Math.floor(seconds) + '秒';
    }else{
        return '0秒';
    }
};

exports.formatDate = function(num){
    return num < 10 ? '0' + num : num;
};
