function to_index() {
    window.location.href = 'https://deri.finance/index#/m.index'
}

var docs_show = false

$(function () {
    $('.logo').click(
        function () {
            to_index()
        }
    )
    // $('.DERI_svg').click(
    //     function () {
    //         to_index()
    //     }
    // )
    $('#menu-button').click(
        function () {
            $('#menu').animate({width: 'toggle'})
        }
    )
    $('#X').click(
        function () {
            $('#menu').animate({width: 'toggle'})
        }
    )
    // $('.show_wechat').click(
    //     function () {
    //         console.log(this)
    //         a = $('.show_wechat').find('#wechat').css('background','green')
    //         a.hide()
    //         // console.log(a)
    //         // $('#wechat').show()
    //     }
    // )
})

function docs() {
    docs_show = !docs_show
    if (docs_show) {
        $('#docs_index_outer').show()
    } else {
        $('#docs_index_outer').hide()
    }

}

