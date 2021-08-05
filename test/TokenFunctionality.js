//https://ethereum.stackexchange.com/questions/58917/contract-state-wont-change-during-truffle-tests
//https://ethereum.stackexchange.com/questions/9103/how-can-you-handle-an-expected-throw-in-a-contract-test-using-truffle-and-ethere/17707
const TokenFunctionality = artifacts.require("ReservationTokenFunctions");

contract("ReservationTokenFunctions", async accounts  =>{
    it("Create Restaurant Successful", async () =>{
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const event = await instance.registerRestaurant.call(restaurantName);
      assert.equal(event[0], restaurantName);
    });
    it("Create User Successful", async () =>{
        const userName = "Satoshi";
        const instance =  await TokenFunctionality.deployed();
        const userCreateEvent = await instance.registerUser.call(userName);
        assert.equal(userCreateEvent[0], userName);
    });
    it("Create Reservation By Restaurant Successful", async() =>{
      const restaurantAccount = accounts[0];
      // deploy restaurant
      const restaurantName = "Saizeriya";
      const instance5 =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance5.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance5.createReservation(dateTime,tableNo,pax,{from: restaurantAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance5.getRestaurantReservationsAll.call(restaurantAccount);
      // assert that there is one reservation made under restaurant address
      assert.lengthOf(retrieveReservations, 1);
    });
    it("Accept Reservation By Restaurant Successful", async() =>{
      const restaurantAccount = accounts[5];
      const userAccount = accounts[6];
      // deploy restaurant
      const restaurantName = "Saizeriya";
      const instance6 =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance6.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance6.createReservation(dateTime,tableNo,pax,{from: restaurantAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance6.getRestaurantReservationsAll.call(restaurantAccount);
      // initiate user
      const userName = "Satoshi";
      const userCreateEvent = await instance6.registerUser(userName,{from: userAccount});
      // accept reservation by restaurant 
      const acceptReservation = await instance6.acceptReservation(retrieveReservations[0],userAccount,{from: restaurantAccount});
    });
    it("Create Two Restaurant with Same Account Address Throws Error ", async() =>{
      const restaurantAccount = accounts[3];
      const restaurantName = "Saizeriya";
      const instance2 =  await TokenFunctionality.deployed();
      await instance2.registerRestaurant(restaurantName,{from: restaurantAccount});
      try {
        const restaurantName2 = "McDonald";
        await instance2.registerRestaurant(restaurantName2,{from: restaurantAccount});
        assert.fail("restaurantCreateEvent2 should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "restaurantCreateEvent2: The error message should contain 'revert'");
      };
    });
    it("Create Two User with Same Account Address Throws Error ", async() =>{
      const userAccount = accounts[4];
      const userName = "Satoshi";
      const instance4 =  await TokenFunctionality.deployed();
      await instance4.registerUser(userName,{from: userAccount});
      try {
        const userName2 = "Bob";
        await instance4.registerUser(userName2,{from: userAccount});
        assert.fail("registerUser should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "registerUser: The error message should contain 'revert'");
      }
    });
})