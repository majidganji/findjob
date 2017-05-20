$(document).ready(function () {
    var page = 1;
    $(window).scroll(function() {
        if(($(window).scrollTop() + $(window).height()) === $(document).height()) {
            if(page < maxPage){
                $.ajax({
                    url: window.location.pathname,
                    type: 'get',
                    data:{
                        pageId: ++page
                    },
                    dataType: 'json',
                    success: function (result) {
                        result.forEach(function (p1, p2, p3) {
                            addItem(p1);
                        });
                    }
                });
            }
        }
    });
    function addItem(item) {
        var divRoot = document.createElement('div');
        divRoot.classList.add('col-sm-4');

        var divWell = document.createElement('div');
        divWell.classList.add('well');
        divWell.classList.add('well-sm');

        var link = document.createElement('a');
        link.href = '/detail/' +item.slug +'/'+ item.id;
        link.classList.add('link');

        var h5 = document.createElement('h5');
        h5.classList.add('title');
        h5.textContent = item.title;

        var hr = document.createElement('hr');

        var divDetail = document.createElement('div');
        divDetail.classList.add('detail');
        divDetail.classList.add('text-muted');

        var pCity = document.createElement('p');
        pCity.classList.add('pull-right');
        pCity.textContent =  item.city ? (item.city.name ? item.city.name : req.cookies.selectedcity.name ) : "شهر ندارد";

        var pDate = document.createElement('p');
        pDate.classList.add('pull-left');
        pDate.textContent =  moment(item.createdAt).fromNow();
        var divClearfix = document.createElement('div');
        divClearfix.classList.add('clearfix');

        divDetail.appendChild(pCity);
        divDetail.appendChild(pDate);
        divDetail.appendChild(divClearfix);

        link.appendChild(h5);
        link.appendChild(hr);

        divWell.appendChild(link);
        divWell.appendChild(divDetail);

        divRoot.appendChild(divWell);

        document.getElementById('content').appendChild(divRoot);
    }
});