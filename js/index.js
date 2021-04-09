$(function () {
    console.log(2222222)
    var adderss, type = 0, votingoptions;
    var contract = new Chain();
    $('#vote').on('click', vote)
    connectWallet();

    $('#connect_wallet').click(
        function () {
            connectWallet();
        }
    )


    function vote() {
        let button = $('#vote')
        if (votingoptions) {
            disableButton(button)
            contract.vote(votingoptions).then(res => {
                enableButton(button)
                getvotingOptions()
            }).catch(err => {
                enableButton(button)
                getvotingOptions()
            })
        } else {

        }
    }

    function getvotingOptions() {
        contract.getvotingOptions().then(res => {
            console.log(res)
            let text;
            if (res == 1) {
                text = 'I'
            }
            if (res == 2) {
                text = 'II'
            }
            if (res == 3) {
                text = 'III'
            }
            if (res == 0) {
                text = ''
            }
            $('#vote_o').text(`${text}`)
        })
    }

    function connectWallet() {
        console.log(1111111)
        contract.connectWallet().then((res) => {
            console.log('sssss')
            if (res.success) {
                let walletid = ethereum.networkVersion;
                console.log(walletid)
                if (walletid == 1) {
                    console.log(555555555)
                    type = 0;
                    $('#netlogo').attr("src", "./img/logo-ethereum.png")
                    $('#nettext').text('ETHEREUM');
                    $('#walletSymbol').text('ETH');
                    if (walletid == 56) {
                        type = 1;
                        $('#netlogo').attr("src", "./img/logo-bsc.png")
                        // $('.netlogo').css(
                        //     "background-image",'url(../img/bsc.png)'
                        // );
                        $('#nettext').text('BSC');
                        $('#walletSymbol').text('BNB');
                    }
                    if (walletid == 128) {
                        type = 2;
                        $('#netlogo').attr("src", "./img/logo-heco.png")
                        $('#nettext').text('HECO');
                        $('#walletSymbol').text('HT');
                    }
                    contract.initialize(0, type).then(() => {
                        adderss = contract.account
                        let account = contract.account;
                        let chainId = contract.chanId
                        account = account.slice(0, 6) +
                            "***" +
                            account.slice(account.length - 4, account.length);
                        $('#adderss').text(account);
                        $('#connect_wallet').hide();
                        $('#adderssbtn').css('display','inline');
                        $('#network_text_logo').css('display','inline');

                        contract.getUserWalletBalence(contract.account).then((res) => {

                            $('#wallet').text(parseFloat(res).toFixed(4));
                        });

                        getvotingOptions();
                        getDeriVotingPower(+chainId, contract.account).then((res) => {
                            console.log(res)
                            let power;
                            let balanceOfDeri = +res.balanceOfDeri;
                            let balanceOfSlp = +res.balanceOfSlp;
                            let totalDeriOnSushi = +res.totalDeriOnSushi;
                            let totalSupply = +res.totalSupply;
                            let tot;
                            if (totalSupply == 0) {
                                tot = 0;
                                power = balanceOfDeri
                            } else {
                                power = balanceOfDeri + (balanceOfSlp * totalDeriOnSushi / totalSupply)
                                tot = balanceOfSlp * totalDeriOnSushi / totalSupply
                            }
                            $('.power').text(`${balanceOfDeri} + ${tot} = ${power}`)
                        });
                    })
                } else {
                    alert('Cannot connect wallet')
                }
            }
        })
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
