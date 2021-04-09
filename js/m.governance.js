function to_index() {
    window.location.href = 'https://deri.finance/index#/m.index'
}

var docs_show = false

$(function () {
    $('#logo_svg').click(
        function () {
            to_index()
        }
    )
    $('#DERI_svg').click(
        function () {
            to_index()
        }
    )
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
})

function docs(){
    docs_show = !docs_show
    if(docs_show){
        $('#docs_index_outer').show()
    }else{
        $('#docs_index_outer').hide()
    }

}

