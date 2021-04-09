function to_index() {
    window.location.href = 'https://deri.finance/'
}

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
    $('#Docs').mouseover(
        function (){
            console.log(111111111111)
            $('#docs_index_outer').show()
        }
    )
    $('#Docs').mouseout(
        function (){
            $('#docs_index_outer').hide()
        }
    )
    $('#docs_index_outer').mouseover(
        function (){
            $('#docs_index_outer').show()
        }
    )
    $('#docs_index_outer').mouseout(
        function (){
            $('#docs_index_outer').hide()
        }
    )
})
