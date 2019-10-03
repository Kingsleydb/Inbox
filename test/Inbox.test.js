const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); 
const { interface, bytecode } = require('../compile');

// create local test network to ganache
const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let inbox;
const initialString = "hi there!"

beforeEach(async () => {
    // get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [initialString]} )
        .send({ from: accounts[0], gas: '1000000' });

    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, initialString);
    });

    it('can set a new message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});













// testing with Mocha 

// class Car {
//     park(){
//         return 'stopped';
//     }

//     drive(){
//         return 'vroom';
//     }
// }

// let car;
// beforeEach(() => {
//     car = new Car();
// });

// describe('Car', () => {
//     it('tests park function', () => {
//         assert.equal(car.park(), 'stopped');
//     });

//     it('tests drive', () => {
//         assert.equal(car.drive(), 'vroom');
//     });
// });