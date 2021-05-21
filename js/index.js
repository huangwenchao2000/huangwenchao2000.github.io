$(function () {
    var adderss, type = 0, votingoptions;
    var contract = new Chain();
    var MaxDeri;
    var sum = 0; 
    $('#vote').on('click', vote)
    $('#unlock').on('click', unlock)
    connectWallet();

    $('#connect_wallet').click(
        function () {
            connectWallet();
        }
    )
    function unlock(){
        let button = $('#unlock')
        disableButton(button)
        contract.unlock().then(res=>{
            console.log(res)
            if(res.success){
                $('#unlock').hide();
                $('#VOTE').show();
            }else{
                $('#unlock').show();
                $('#VOTE').hide();
            }
            enableButton(button)
        })
    }
    function vote() {
        let button = $('#vote')
        let num =  +$('#deri-num').val();
        let id = $("input[name='network']:checked").val()
        console.log(num,MaxDeri)
        if(!id){   
            alert('aaa')     
            return;
        }
        if(num > MaxDeri){
            alert('Insufficient balance in wallet');
            return;
        }
        disableButton(button)
        contract.vote(+id,num).then(res => {
            enableButton(button)
            votingsForOptions()
            getWalletBalance();
        }).catch(err => {
            enableButton(button)
            votingsForOptions()
            getWalletBalance()
        })
    }

   

    async function connectWallet() {
        contract.connectWallet().then((res) => {
            if (res.success) {
                window.ethereum.request({ method: "net_version" }).then(id=>{
                   let walletid = id;
                // if (walletid == 1) {
                //     type = 0;
                //     $('#netlogo').attr("src", "./img/logo-ethereum.png")
                //     $('#nettext').text('ETHEREUM');
                //     $('#walletSymbol').text('ETH');
                // } else if (walletid == 56) {
                //     type = 1;
                //     $('#netlogo').attr("src", "./img/logo-bsc.png")
                //     // $('.netlogo').css(
                //     //     "background-image",'url(../img/bsc.png)'
                //     // );
                //     $('#nettext').text('BSC');
                //     $('#walletSymbol').text('BNB');
                // } else if (walletid == 128) {
                //     type = 2;
                //     $('#netlogo').attr("src", "./img/logo-heco.png")
                //     $('#nettext').text('HECO');
                //     $('#walletSymbol').text('HT');
                // } else {
                //     $('#noNetworkText').text('Unsupported Chain ID ' + walletid + '!')
                //     $('#noNetwork').show()
                //     $('#connect_wallet').hide();
                //     return
                // } 
                if (walletid == 97) {
                    type = 1;
                    $('#netlogo').attr("src", "./img/logo-bsc.png")
                    // $('.netlogo').css(
                    //     "background-image",'url(../img/bsc.png)'
                    // );
                    $('#nettext').text('BSC');
                    $('#walletSymbol').text('BNB');
                } 
               
                contract.initialize(0, type).then(() => {
                    adderss = contract.account
                    let account = contract.account;
                    account = account.slice(0, 6) +
                        "..." +
                        account.slice(account.length - 4, account.length);
                    $('#adderss').text(account);
                    $('#connect_wallet').hide();
                    $('#adderssbtn').css('display', 'inline');
                    $('#network_text_logo').css('display', 'inline');
                    contract.isUnlocked().then(res=>{
                        if(res){
                            $('#unlock').hide();
                            $('#vote').show();
                        }else{
                            $('#unlock').show();
                            $('#vote').hide();
                        }
                    })
                    votingsForOptions();
                    getWalletBalance();
                })
                })

            } else {
                alert('Cannot connect wallet')
            }
        })
    }
    function getWalletBalance(){
        contract.getUserWalletBalence(contract.account).then((res) => {
            $('#wallet').text(parseFloat(res).toFixed(4));
        });
        contract.getWalletDeri(contract.account).then(res=>{
            MaxDeri = parseInt(res);
            $('.wallet-deri').text(parseInt(res))
        })
    }
    async function maxderi(){
        for(let i = 0;i<10;i++){
            let res =  await contract.votingsForOptions(i)
            sum += +res;
        }  
    }
    async function votingsForOptions(){
        await maxderi();
        for(let i = 0;i<10;i++){
            let per;
            let res =  await contract.votingsForOptions(i)
            res = parseInt(res)
            switch (i) {
                case 0:
                    $('.one').text(`${res} DERI`)
                    per = (+res/+sum) * 100;
                    $('.I-per').css( "width",`${per}%`)
                    break;
                case 1:
                    $('.two').text(`${res} DERI`)
                    per = (+res/+sum) * 100;
                    $('.II-per').css( "width",`${per}%`)
                    break;
                case 2:
                    $('.three').text(`${res} DERI`)
                    per = (+res/+sum) * 100;
                    $('.III-per').css( "width",`${per}%`)
                    break;
                case 3:
                    $('.four').text(`${res} DERI`)
                    per = (+res/+sum) * 100;
                    $('.IV-per').css( "width",`${per}%`)
                    break;
                case 4:
                    $('.five').text(`${res} DERI`)
                    per = (+res/+sum) * 100;
                    $('.V-per').css( "width",`${per}%`)
                    break;
                case 5:
                    $('.six').text(`${res} DERI`)
                    per = (+res/+sum) * 100;
                    $('.VI-per').css( "width",`${per}%`)
                    break;
                case 6:
                    $('.seven').text(`${res} DERI`)
                    per = (+res/+sum) * 100;
                    $('.VII-per').css( "width",`${per}%`)
                    break;
                case 7:
                    $('.eight').text(`${res} DERI`)
                    per = (+res/+sum) * 100;
                    $('.VIII-per').css( "width",`${per}%`)
                    break;
                case 8:
                    $('.nine').text(`${res} DERI`)
                    per = (+res/+sum) * 100;
                    $('.IX-per').css( "width",`${per}%`)
                    break;
                case 9:
                    $('.ten').text(`${res} DERI`)
                    per = (+res/+sum) * 100;
                    $('.X-per').css( "width",`${per}%`)
                    break;
                default:
                    break;
            }
        }  
    }
    function disableButton(button) {
        button.find("span.spinner").show();
        button.attr("disabled", true);
    }

    function enableButton(button) {
        button.find("span.spinner").hide();
        button.attr("disabled", false);
    }
})
