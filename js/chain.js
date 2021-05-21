BigNumber.config({
    DECIMAL_PLACES: 18,
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
    EXPONENTIAL_AT: 256
});



function bg(value, base=0) {
    if (base == 0) {
        return BigNumber(value);
    } else if (base > 0) {
        return BigNumber(value).times(BigNumber('1' + '0'.repeat(base)));
    } else {
        return BigNumber(value).div(BigNumber('1' + '0'.repeat(-base)));
    }
}

function deri_natural(value) {
    return bg(value, -18);
}

function natural_deri(value) {
    return bg(value, 18).toFixed(0).toString();
}

function max(value1, value2) {
    if (value1.gte(value2)) {
        return value1;
    } else {
        return value2;
    }
}

function min(value1, value2) {
    if (value1.lte(value2)) {
        return value1;
    } else {
        return value2;
    }
}


class Chain {

    constructor() {
        this.web3 = null;
        this.ethereum = null;
        this.account = null;

        this.oracleUrl = null;
        this.addresses = null;
        this.abifiles = null;
        this.methods = null;

        this.pool = null;
        this.deri = null;
        this.pToken = null;
        this.lToken = null;
        this.dToken = null;
        this.deriDataBaseAbi = null;

        this.staking = null;
        this.apy = null;
        this.symbol = null;
        this.bSymbol = null;
        this.bDecimals = null;
        this.databaseAddress = null;
        this.deriAddress = null;
        this.bsurl = null;
        this.arrbsurl = null;
        this.errindex = 0;
        this.valid = null;
        this.toChainId = null;
        this.fromChainId = null;
        this.DeriVote = null;
        this.Deri = null;
        this.votingoptions = null;

        this.multiplier = null;
        this.feeRatio = null;
        this.minPoolMarginRatio = null;
        this.minInitialMarginRatio = null;
        this.minMaintenanceMarginRatio = null;
        this.minAddLiquidity = null;
        this.redemptionFeeRatio = null;
        this.fundingRateCoefficient = null;
        this.minLiquidationReward = null;
        this.maxLiquidationReward = null;
        this.liquidationCutRatio = null;
        this.priceDelayAllowance = null;
        this.getClainmedamount = null;
        this.oracle = {};
        this.balance = {};
        this.position = {
            volume: bg(0),
            cost: bg(0),
            lastCumuFundingRate: bg(0),
            margin: bg(0),
            lastUpdateTimestamp: bg(0)
        };
        this.states = {};
        this.chanId = null;

    }

    async connectWallet() {
        if (typeof window.ethereum != undefined) {
            this.web3 = new Web3(ethereum);
            this.ethereum = window.ethereum;
            this.account = (await ethereum.request({method: 'eth_requestAccounts'}))[0];
            // this.account = '0xb1b27ba904a436f21a12bbc14672e53eb29e6f5c';
            return {success: true, account: this.account};
        } else {
            return {success: false, error: 'Cannot connect wallet'};
        }
    }
    async isUnlocked() {
        let allowance = await this.Deri.methods['allowance'](this.account, '0xDe589703D21647246a456fbeE81f136CF4cc14e7').call();
        console.log(allowance)
        allowance = deri_natural(allowance);
        console.log( allowance.gt(0))
        return allowance.gt(0);
    }
    async votingsForOptions(optionId){
        let res = await this.DeriVote.methods['votingsForOptions'](1,optionId).call();
        return deri_natural(res).toString();
    }
    async unlock() {
        let gas = 0;
        let res;
        try {
            for (let i = 0; i < 20; i++) {
                try {
                    gas = await this.Deri.methods['approve']('0xDe589703D21647246a456fbeE81f136CF4cc14e7', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').estimateGas({'from': this.account});
                    gas = parseInt(gas * 1.25);
                    break;
                } catch (err) {
    
                }
            }
            if (gas == 0) gas = 532731;
            if(gas>532731) gas = 532731;
            let tx = await this.Deri.methods['approve']('0xDe589703D21647246a456fbeE81f136CF4cc14e7','0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').send({'from': this.account, 'gas': gas});
            res = { success: true, transaction: tx };
        } catch (error) {
            res = { success: false, error: err };
        }
        return res
        
    }
    async initialize(index=0,type) {
        await this._initializeContracts(index,type);
        await this._bindEvent();
    }

    async getUserWalletBalence(account){
        let balance = await this.web3.eth.getBalance(account);
        const res = Web3.utils.fromWei(balance)
        return res
    }
    async getWalletDeri(account){
        let bDecimals = await this.Deri.methods['decimals']().call();
        let balance = await this.Deri.methods['balanceOf'](account).call();
        return bg(balance, -bDecimals);
    }

    //================================================================================
    // Interfaces
    //================================================================================
   
    async vote(optionId, amount){
        let gas = 0;
        for (let i = 0; i < 20; i++) {
            try {
                gas = await this.DeriVote.methods['vote'](optionId, natural_deri(amount)).estimateGas({'from': this.account});
                gas = parseInt(gas * 1.25);
                break;
            } catch (err) {

            }
        }
        if (gas == 0) gas = 532731;
        if(gas>532731) gas = 532731;
        let tx = await this.DeriVote.methods['vote'](optionId, natural_deri(amount)).send({'from': this.account, 'gas': gas});
        return tx;
    }



    //================================================================================
    // Internals
    //================================================================================

    async _bindEvent() {
        this.ethereum.on('accountsChanged', (accounts) => {
            window.location.reload();
        })
        this.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        })

    }

    async _call(contract, func, params=[]) {
        return await contract.methods[this.methods[func]](...params).call();
    }

    async _transact(contract, func, params=[]) {
        let gas = 0;
        for (let i = 0; i < 20; i++) {
            try {
                gas = await contract.methods[this.methods[func]](...params).estimateGas({'from': this.account});
                gas = parseInt(gas * 1.25);
                break;
            } catch (err) {

            }
        }
        if (gas == 0) gas = 532731;
        let tx = await contract.methods[this.methods[func]](...params).send({'from': this.account, 'gas': gas});
        return tx;
    }

    async _transactPool(contract, func, params=[]) {
        let signed = [this.oracle.timestamp, this.oracle.price, this.oracle.v, this.oracle.r, this.oracle.s];

        let gas = 0;
        for (let i = 0; i < 20; i++) {
            try {
                gas = await contract.methods[this.methods[func]](...params, ...signed).estimateGas({'from': this.account});
                gas = parseInt(gas * 1.25);
                break;
            } catch (err) {

            }
        }
        if (gas == 0) gas = 532731;
        let tx = await contract.methods[this.methods[func]](...params, ...signed).send({'from': this.account, 'gas': gas});
        return tx;
    }

    async _readjson(filename) {
        let response = await fetch(`static/config/${filename}`);
        return await response.json();
    }

    async _initializeContracts(index,type) {
        try {
            let config = await this._readjson('config.json');
            this.addresses = config.addresses[type][index];
            this.chanId = this.addresses.chanId;
            this.abifiles = config.abifiles;
            let DeriVoteAbi = await this._readjson(this.abifiles.DeriVote);
            let DeriAbi = await this._readjson(this.abifiles.Deri);
            this.DeriVote = new this.web3.eth.Contract(DeriVoteAbi, this.addresses.DeriVote);
            this.Deri = new this.web3.eth.Contract(DeriAbi,this.addresses.Deri)
        } catch (err) {
            console.log(`Chain: _initializeContracts() error: ${err}`);
        }
    }




    //================================================================================
    // Updates
    //================================================================================

    //================================================================================
    // Calculations
    //================================================================================

    _calculateShareValue(price) {
        return this.balance.ltotal.eq(0) ? bg(0) : this.states.liquidity.div(this.balance.ltotal);
    }

    _calculateMaxRemovableShares(price) {
        let shareValue = this._calculateShareValue();
        let value = this.states.tradersNetVolume.times(price).times(this.multiplier);
        let removable = this.states.liquidity.plus(this.states.tradersNetCost).minus(value).minus(value.abs().times(this.minPoolMarginRatio));
        let shares = max(min(this.balance.ltoken, removable.div(shareValue)), bg(0));
        return shares;
    }

    _calculateEntryPrice(price) {
        return this.position.volume.eq(0) ? bg(0) : this.position.cost.div(this.position.volume).div(this.multiplier);
    }

    _calculateMarginHeld(price) {
        return this.position.volume.abs().times(price).times(this.multiplier).times(this.minInitialMarginRatio);
    }

    _calculatePnl(price) {
        return this.position.volume.times(price).times(this.multiplier).minus(this.position.cost);
    }

    _calculateMaxWithdrawMargin(price) {
        if (this.position.volume.eq(0)) {
            return this.position.margin;
        } else {
            let held = this._calculateMarginHeld(price);
            let pnl = this._calculatePnl(price);
            let withdrawable = max(this.position.margin.plus(pnl).minus(held.times(1.02)), bg(0));
            return withdrawable;
        }
    }

    _calculateLiquidationPrice(price) {
        let tmp = this.position.cost.minus(this.position.margin).div(this.position.volume).div(this.multiplier);
        let res = this.position.volume.gt(0) ? tmp.div(bg(1).minus(this.minMaintenanceMarginRatio)) : tmp.div(bg(1).plus(this.minMaintenanceMarginRatio));
        res = max(res, bg(0));
        return res;
    }

    _isOrderValid(price, volume, amount) {
        let minMargin = this.position.volume.plus(volume).abs().times(price).times(this.multiplier).times(this.minInitialMarginRatio);
        let poolMaxVolume = this.states.liquidity.div(this.minPoolMarginRatio).div(price).div(this.multiplier);

        if (this.position.margin.plus(amount).gte(minMargin)) {
            if (volume.lte(poolMaxVolume.minus(this.states.tradersNetVolume)) &&
                volume.gte(poolMaxVolume.negated().minus(this.states.tradersNetVolume))) {
                return {success: true};
            } else {
                return {success: false, message: 'Pool insufficient liquidity'};
            }
        } else {
            return {success: false, message: 'Trader insufficient margin'};
        }
    }

}
