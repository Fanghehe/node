$(function(){
    var Select = BUI.Select;
    var suggest = new Select.Suggest({
        render:'#input-search-wrap',
        content:'<input type="text" class="form-control input-search" id="input-search" placeholder="Search">',
        forceFit:false,
        name:'input-search',
        dataType:'json',
        url:'/doSuggest'
        //data:['1222224','234445','122','111112222241222224111111111111111111111111']
    });
    suggest.render();
   $('#input-search').on('focus',function(e){
        $('#input-search-wrap').animate({width:400},500,function(){});
   });
});