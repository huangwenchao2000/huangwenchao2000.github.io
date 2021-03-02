$(function () {
    var from_or_to = 0, valid, from_chainId, to_chainId, from_check = 0, type = 0, blance, network, adderss;
    var contract = new Chain();
    var timer1,timer2;
    $('#prompt_close').on('click', closeprompt);
    $('#addbut').on('click', closeprompt);
    $('#network_close').on('click', close_network);
    $('.from_network').on('click', openselectnetwork);
    $('.to_network').on('click', openselectnetwork);
    $('.chain').on('click', select_network);
    $('#approves').on('click', approves);
    $('.connect').on('click', connectWallet);
    $('#claim').on('click', mintDeri);
    $('#sends').on('click', freeze);
    function freeze() {
        let amount = $('.c-input').val();
        let button = $('#sends');
        if (from_chainId) {
            if(to_chainId != from_chainId){
                if (amount > 0) {
                    if (+amount <= blance) {
                        if (!valid) {
                            disableButton(button);
                            contract.freeze(amount, to_chainId).then(res => {
                                let toNetwork;
                                if (to_chainId == 97) {
                                    toNetwork = 'BSC Testnet'
                                }
                                if (to_chainId == 256) {
                                    toNetwork = 'Heco Testnet'
                                }
                                if (to_chainId == 3) {
                                    toNetwork = 'ROPSTEN'
                                }
                                if (res.success) {
                                    let one = `${amount} DERI arrived at ${toNetwork}`
                                    let tow = `Please connect to ${toNetwork}`
                                    $('.prompt_one').text(one);
                                    $('.prompt_tow').text(tow);
                                    $('.prompt').show();
                                    connectWallet()
                                    timer1 = setInterval(() => {
                                        connectWallet()
                                    }, 2000);
                                }else{
                                    enableButton(button)
                                }
                            })
                        } 
                    }else{
                        alert('There is not enough Amount')
                    }
                } else {
                    alert('Amount must be greater than zero')
                }
            }else{
                alert('Please select a different network');
            }

        } else {
            alert('Please select to first')
        }
    }
    function mintDeri() {
        let button = $('#claim')
        disableButton(button);
        contract.mintDeri().then((res => {
            if (res.success) {
                connectWallet();
                timer2 = setInterval(() => {
                    connectWallet();
                }, 2000);
            }else{
                enableButton(button)
            }
        }))

    }
    function approves() {
        let button = $('#approves');
        if (!adderss) {
            alert('Cannot connect wallet');
            return
        }
        if(!from_chainId){
            alert('Please select From first');
            return;
        }
        disableButton(button);
        contract.unlock().then(res => {
            enableButton(button);
            isapproves();
        }).catch(err => {
            console.log(err)
        })
    }
    function isapproves() {
        contract.isUnlocked().then(res => {
            if (res) {
                $('.send').show()
                $('.approve').hide()
                if (valid) {
                    $('.claiming').show();
                    $('.claim').show();
                    $('.sending').hide();
                    $('.approve').hide();
                    $('.send').hide();
                }
            } else {
                $('.send').hide()
                $('.approve').show()
            }
        }).catch(err => {

        })
    }
    connectWallet();
    function connectWallet() {
        contract.connectWallet().then((res) => {
            if (res.success) {
                contract.initialize(0, type).then(() => {
                    adderss = contract.account
                    let account = contract.account;
                    account = account.slice(0, 6) +
                        "***" +
                        account.slice(account.length - 4, account.length);
                    $('#adderss').text(account);
                    $('.connect').hide();
                    valid = contract.valid;
                    console.log(valid)
                    if (valid) {
                        if (contract.fromChainId == '3') {
                            $('.from_eth').show();
                            $('.from_heco').hide();
                            $('.from_bsc').hide();
                            $('.chain').eq(2).hide().siblings().show()
                        }
                        if (contract.fromChainId == '97') {
                            $('.from_bsc').show();
                            $('.from_heco').hide();
                            $('.from_eth').hide();
                            $('.chain').eq(0).hide().siblings().show();
                        }
                        if (contract.fromChainId == '256') {
                            $('.from_heco').show();
                            $('.from_bsc').hide();
                            $('.from_eth').hide();
                            $('.chain').eq(1).hide().siblings().show()
                        }
                        if (contract.toChainId == '3') {
                            type = 0;
                            $('.to_eth').show();
                            $('.to_heco').hide();
                            $('.to_bsc').hide();
                        }
                        if (contract.toChainId == '97') {
                            type = 1;
                            $('.to_eth').hide();
                            $('.to_heco').hide();
                            $('.to_bsc').show();
                        }
                        if (contract.toChainId == '256') {
                            type = 2;
                            $('.to_eth').hide();
                            $('.to_heco').show();
                            $('.to_bsc').hide();
                        }
                        if (ethereum.networkVersion != contract.toChainId) {
                            if (contract.toChainId == '3') {
                                text = 'ROPSTEN';
                            }
                            if (contract.toChainId == '97') {
                                text = 'BSC Testnet'
                            }
                            if (contract.toChainId == '256') {
                                text = 'HECO Testnet'
                            }
                            let woor = `Please connect to ${text}`;
                            $('#claim').attr("disabled", true);
                            $('#approves').attr("disabled", true);
                            $('.woor').text(woor)
                        } else {
                            $('.woor').text('')

                        }
                        contract.initialize(0, type).then((res) => {
                            getWalletBalance();
                            if (valid) {
                                $('.claiming').show();
                                $('.claim').show();
                                $('.sending').hide();
                                $('.approve').hide();
                                $('.send').hide();
                                $('.amounted').text(contract.amount)
                            }
                        })
                        $('.fromselect').hide()
                        $('.toselect').hide()
                        $('.disable').show();
                        from_chainId = contract.fromChainId;
                        to_chainId = contract.toChainId;
                        return;
                    }

                    if (from_chainId) {
                        network = contract.chanId;
                        if (ethereum.networkVersion != network) {
                            let text;
                            if (network == '3') {
                                text = 'ROPSTEN';
                            }
                            if (network == '97') {
                                text = 'BSC Testnet'
                            }
                            if (network == '256') {
                                text = 'HECO Testnet'
                            }
                            let woor = `Please connect to ${text}`
                            $('.woor').text(woor)
                            $('#approves').attr("disabled", true);
                            $('.balance').text('--')
                            return;
                        }
                        $('.woor').text('')
                        $('.disable').hide();
                        $('.claiming').hide();
                        $('.claim').hide();
                        $('.sending').show();
                        $('.send').show();
                        getWalletBalance();
                        isapproves();
                    }
                    let lstoid = sessionStorage.getItem('toid')
                    if(lstoid){
                        to_chainId = lstoid;
                        if (to_chainId == '97') {
                            $('.to_bsc').show();
                            $('.to_heco').hide();
                            $('.to_eth').hide();
                        }
                        if (to_chainId == '256') {
                            $('.to_heco').show();
                            $('.to_bsc').hide();
                            $('.to_eth').hide();
                        }
                        if (to_chainId == '3') {
                            $('.to_eth').show();
                            $('.to_heco').hide();
                            $('.to_bsc').hide();
                        }
                        $('.toselect').hide()
                    }
                    let lsfromid = sessionStorage.getItem('fromid')
                    if(lsfromid){
                        from_chainId = lsfromid;
                        if (from_chainId == '97') {
                            type = 1;
                            $('.from_bsc').show();
                            $('.from_heco').hide();
                            $('.from_eth').hide();
                            $('.chain').eq(0).hide().siblings().show()
                        }
                        if (from_chainId == '256') {
                            type = 2
                            $('.from_heco').show();
                            $('.from_bsc').hide();
                            $('.from_eth').hide();
                            $('.chain').eq(1).hide().siblings().show()
                        }
                        if (from_chainId == '3') {
                            type = 0;
                            $('.from_eth').show();
                            $('.from_heco').hide();
                            $('.from_bsc').hide();
                            $('.chain').eq(2).hide().siblings().show()
                        }
                        from_check = 1;
                        $('.fromselect').hide()
                        if (ethereum.networkVersion != from_chainId) {
                            let network = from_chainId
                            let text;
                            if (network == '3') {
                                text = 'ROPSTEN';
                            }
                            if (network == '97') {
                                text = 'BSC Testnet'
                            }
                            if (network == '256') {
                                text = 'HECO Testnet'
                            }
                            let woor = `Please connect to ${text}`
                            $('.woor').text(woor)
                            $('#approves').attr("disabled", true);
                            $('.balance').text('--')
                            return;
                        }
                        contract.initialize(0,type).then(res=>{
                            getWalletBalance();
                            isapproves();
                        })
                        
                    }
                    
                })
            } else {
                alert('Cannot connect wallet')
            }
        })
    }
    function getWalletBalance() {
        contract.getWalletBalance().then((res) => {
            blance = res;
            $('.balance').text(blance)
        })
    }
    function select_network() {
        let network = $(this).find('span').eq(1).html();
        if(timer1){
            clearInterval(timer1)
        }
        if(timer2){
            clearInterval(timer2)
        }
        if (from_or_to == 0) {
                if (network == 'BSC Testnet') {
                    from_chainId = 97;
                    type = 1;
                    $('.from_bsc').show();
                    $('.from_heco').hide();
                    $('.from_eth').hide();
                    $('.chain').eq(0).hide().siblings().show()
                }
                if (network == 'Heco Testnet') {
                    from_chainId = 256;
                    type = 2
                    $('.from_heco').show();
                    $('.from_bsc').hide();
                    $('.from_eth').hide();
                    $('.chain').eq(1).hide().siblings().show()
                }
                if (network == 'ROPSTEN') {
                    from_chainId = 3;
                    type = 0;
                    $('.from_eth').show();
                    $('.from_heco').hide();
                    $('.from_bsc').hide();
                    $('.chain').eq(2).hide().siblings().show()
                }
                from_check = 1;
                sessionStorage.setItem('fromid',from_chainId);
                if (adderss) {
                    connectWallet()
                }
                $('.fromselect').hide()
            
            

        } else {
            if (network == 'BSC Testnet') {
                to_chainId = 97;
                $('.to_bsc').show();
                $('.to_heco').hide();
                $('.to_eth').hide();
            }
            if (network == 'Heco Testnet') {
                to_chainId = 256;
                $('.to_heco').show();
                $('.to_bsc').hide();
                $('.to_eth').hide();
            }
            if (network == 'ROPSTEN') {
                to_chainId = 3;
                $('.to_eth').show();
                $('.to_heco').hide();
                $('.to_bsc').hide();
            }
            sessionStorage.setItem('toid',to_chainId);
            $('.toselect').hide()
        }
        $('.select_network').hide();
    }
    function closeprompt() {
        $('.prompt').hide();
    }
    function close_network() {
        $('.select_network').hide();
    }
    function openselectnetwork() {
        let cla = $(this).attr('class')

        if (from_check == 0) {
            if (cla == 'to_network') {
                alert('Please select From first ')
                return;
            }
        }
        if (cla == 'from_network') {
            from_or_to = 0;
            $('.chain').show()
        } else {
            from_or_to = 1;

        }
        $('.select_network').show()
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