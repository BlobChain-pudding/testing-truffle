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
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: restaurantAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAccount);
      // assert that there is one reservation made under restaurant address
      assert.lengthOf(retrieveReservations, 1);
    });
    it("Accept Reservation By Restaurant Successful", async() =>{
      const restaurantAccount = accounts[5];
      const userAccount = accounts[6];
      // deploy restaurant
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: restaurantAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAccount);
      // initiate user
      const userName = "Satoshi";
      const userCreateEvent = await instance.registerUser(userName,{from: userAccount});
      // accept reservation by restaurant 
      const acceptReservation = await instance.acceptReservation(retrieveReservations[0],userAccount,{from: restaurantAccount});
    });
    it("Visited Restaurant Successful", async() =>{
      const restaurantAccount = accounts[7];
      const userAccount = accounts[8];
      // deploy restaurant
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: restaurantAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAccount);
      // initiate user
      const userName = "Satoshi";
      const userCreateEvent = await instance.registerUser(userName,{from: userAccount});
      // accept reservation by restaurant 
      const acceptReservation = await instance.acceptReservation(retrieveReservations[0],userAccount,{from: restaurantAccount});
      // user visited restaurant
      const visitReservation = await instance.visitedRestaurant(retrieveReservations[0],userAccount,{from: restaurantAccount});
    });
    it("Create Two Restaurant with Same Account Address Throws Error ", async() =>{
      const restaurantAccount = accounts[3];
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      await instance.registerRestaurant(restaurantName,{from: restaurantAccount});
      try {
        const restaurantName2 = "McDonald";
        await instance.registerRestaurant(restaurantName2,{from: restaurantAccount});
        assert.fail("restaurantCreateEvent2 should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "restaurantCreateEvent2: The error message should contain 'revert'");
      };
    });
    it("Create Two User with Same Account Address Throws Error ", async() =>{
      const userAccount = accounts[4];
      const userName = "Satoshi";
      const instance =  await TokenFunctionality.deployed();
      await instance.registerUser(userName,{from: userAccount});
      try {
        const userName2 = "Bob";
        await instance.registerUser(userName2,{from: userAccount});
        assert.fail("registerUser should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "registerUser: The error message should contain 'revert'");
      }
    });
    it("Create One Restaurant After Creating One User with Same Account Address Throws Error ", async() =>{
      const account = accounts[9];
      const userName = "Satoshi";
      const instance =  await TokenFunctionality.deployed();
      await instance.registerUser(userName,{from: account});
      try {
        const restaurantName = "Saizeriya";
        await instance.registerRestaurant(restaurantName,{from: account});
        assert.fail("registerRestaurant should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "registerRestaurant: The error message should contain 'revert'");
      }
    });
    it("Create One User After Creating One Restaurant with Same Account Address Throws Error ", async() =>{
      const account = accounts[10];
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      await instance.registerRestaurant(restaurantName,{from: account});
      try {
        const userName = "Satoshi";
        await instance.registerUser(userName,{from: account});
        assert.fail("registerUser should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "registerUser: The error message should contain 'revert'");
      }
    });
    it("Create Reservation By Non-Restaurant Account Throws Error", async() =>{
      const randomAccount = accounts[11];
      const instance =  await TokenFunctionality.deployed();
      // create reservation
      try {
        const dateTime = 1000508; //24htime-DD-MM
        const tableNo = 1;
        const pax = 2;
        const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: randomAccount});
        // check reservation from getRestaurantReservationsAll
        const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAccount);
        // assert that there is one reservation made under restaurant address
        assert.fail("getRestaurantReservationsAll should throw an error");
        // assert.lengthOf(retrieveReservations, 0);
      } catch (err) {
        assert.include(err.message, "revert", "getRestaurantReservationsAll: The error message should contain 'revert'");
      }
    });
    it("Accept Reservation By Non-Restaurant Account Throws Error", async() =>{
      const restaurantAccount = accounts[12];
      const userAccount = accounts[13];
      // deploy restaurant
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: restaurantAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAccount);
      // initiate user
      const userName = "Satoshi";
      const userCreateEvent = await instance.registerUser(userName,{from: userAccount});
      // accept reservation by restaurant 
      try{
        const acceptReservation = await instance.acceptReservation(retrieveReservations[0],userAccount,{from: userAccount});
        assert.fail("acceptReservation should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "acceptReservation: The error message should contain 'revert'");
      }
    });
    it("Accept Reservation by Restaurant A for Restaurant B Throws Error", async() =>{
      const restaurantAAccount = accounts[16];
      const restaurantBAccount = accounts[18];
      const userAccount = accounts[17];
      // deploy restaurant A
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAAccount});
      // deploy restaurant B
      const restaurantName2 = "McD";
      const restaurantCreateEvent2 = await instance.registerRestaurant(restaurantName2,{from: restaurantBAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: restaurantAAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAAccount);
      // initiate user
      const userName = "Satoshi";
      const userCreateEvent = await instance.registerUser(userName,{from: userAccount});
      // accept reservation by restaurant 
      try{
        const acceptReservation = await instance.acceptReservation(retrieveReservations[0],userAccount,{from: restaurantBAccount});
        assert.fail("acceptReservation should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "acceptReservation: The error message should contain 'revert'");
      }
    });
    it("Accept Reservation With Invalid Reservation Hash Throws Error", async() =>{
      const restaurantAccount = accounts[14];
      const userAccount = accounts[15];
      // deploy restaurant
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create Invalid reservation
      const invalidReservation = "invalidReservation";
      // initiate user
      const userName = "Satoshi";
      const userCreateEvent = await instance.registerUser(userName,{from: userAccount});
      // accept reservation by restaurant 
      try{
        const acceptReservation = await instance.acceptReservation(invalidReservation,userAccount,{from: restaurantAccount});
        // console.log(acceptReservation);
        assert.fail("acceptReservation should throw an error");
      } catch (err){
        assert.include(err.message, "INVALID_ARGUMENT", "acceptReservation: The error message should contain 'INVALID_ARGUMENT'");
      }
    });
    it("Accept Reservation For Non-User Account Throws Error", async() =>{
      const restaurantAccount = accounts[19];
      const userAccount = accounts[20];
      // deploy restaurant
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: restaurantAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAccount);
      // accept reservation by restaurant 
      try{
        const acceptReservation = await instance.acceptReservation(retrieveReservations[0],userAccount,{from: restaurantAccount});
        assert.fail("acceptReservation should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "acceptReservation: The error message should contain 'revert'");
      }
    });
    it("Visited Restaurant By Non-Restaurant Account Throws Error", async() =>{
      const restaurantAccount = accounts[21];
      const userAccount = accounts[22];
      // deploy restaurant
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: restaurantAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAccount);
      // initiate user
      const userName = "Satoshi";
      const userCreateEvent = await instance.registerUser(userName,{from: userAccount});
      // accept reservation by restaurant 
      const acceptReservation = await instance.acceptReservation(retrieveReservations[0],userAccount,{from: restaurantAccount});
      try{
        // user visited restaurant
        const visitReservation = await instance.visitedRestaurant(retrieveReservations[0],userAccount,{from: userAccount});
        assert.fail("visitedRestaurant should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "visitedRestaurant: The error message should contain 'revert'");
      }
    });
    it("Visited Restaurant by Restaurant A for Restaurant B Throws Error", async() =>{
      const restaurantAAccount = accounts[23];
      const restaurantBAccount = accounts[24];
      const userAccount = accounts[25];
      // deploy restaurant A
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAAccount});
      // deploy restaurant B
      const restaurantName2 = "McD";
      const restaurantCreateEvent2 = await instance.registerRestaurant(restaurantName2,{from: restaurantBAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: restaurantAAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAAccount);
      // initiate user
      const userName = "Satoshi";
      const userCreateEvent = await instance.registerUser(userName,{from: userAccount});
      // accept reservation by restaurant 
      const acceptReservation = await instance.acceptReservation(retrieveReservations[0],userAccount,{from: restaurantAAccount});
      try{
          // user visited restaurant
        const visitReservation = await instance.visitedRestaurant(retrieveReservations[0],userAccount,{from: restaurantBAccount});
        assert.fail("visitedRestaurant should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "visitedRestaurant: The error message should contain 'revert'");
      }
    });
    it("Visited Restaurant With Invalid Reservation Hash Throws Error", async() =>{
      const restaurantAccount = accounts[26];
      const userAccount = accounts[27];
      // deploy restaurant
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: restaurantAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAccount);
      // initiate user
      const userName = "Satoshi";
      const userCreateEvent = await instance.registerUser(userName,{from: userAccount});
      // accept reservation by restaurant 
      const acceptReservation = await instance.acceptReservation(retrieveReservations[0],userAccount,{from: restaurantAccount});
      // create Invalid reservation
      const invalidReservation = "invalidReservation";
      try{
        // user visited restaurant
        const visitReservation = await instance.visitedRestaurant(invalidReservation,userAccount,{from: restaurantAccount});
        assert.fail("visitedRestaurant should throw an error");
      } catch (err){
        assert.include(err.message, "INVALID_ARGUMENT", "acceptReservation: The error message should contain 'INVALID_ARGUMENT'");
      }
    });
    it("Visited Restaurant For Non-User Account Throws Error", async() =>{
      const restaurantAccount = accounts[28];
      const userAccount = accounts[29];
      const userAccount2 = accounts[30];
      // deploy restaurant
      const restaurantName = "Saizeriya";
      const instance =  await TokenFunctionality.deployed();
      const restaurantCreateEvent = await instance.registerRestaurant(restaurantName,{from: restaurantAccount});
      // create reservation
      const dateTime = 1000508; //24htime-DD-MM
      const tableNo = 1;
      const pax = 2;
      const reservationCreationEvent = await instance.createReservation(dateTime,tableNo,pax,{from: restaurantAccount});
      // check reservation from getRestaurantReservationsAll
      const retrieveReservations = await instance.getRestaurantReservationsAll.call(restaurantAccount);
      // initiate user
      const userName = "Satoshi";
      const userCreateEvent = await instance.registerUser(userName,{from: userAccount});
      // accept reservation by restaurant 
      const acceptReservation = await instance.acceptReservation(retrieveReservations[0],userAccount,{from: restaurantAccount});
      try{
        // user visited restaurant
        const visitReservation = await instance.visitedRestaurant(retrieveReservations[0],userAccount2,{from: restaurantAccount});
        assert.fail("visitedRestaurant should throw an error");
      } catch (err){
        assert.include(err.message, "revert", "visitedRestaurant: The error message should contain 'revert'");
      }
    });
    

})