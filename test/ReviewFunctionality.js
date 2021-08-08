const ReviewFunctionality = artifacts.require("ReviewFunctions");

contract("ReviewFunctions", async accounts  =>{
    it("Post Review Successful", async () =>{
        const restaurantAccount = accounts[0];
        const userAccount = accounts[1];
        // deploy restaurant
        const restaurantName = "Saizeriya";
        const instance =  await ReviewFunctionality.deployed();
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
        // post review
        const reviewContent = "i heard snails @ saizeriya are good";
        const writer = "sy";
        const postReview = await instance.postReview(reviewContent,writer,retrieveReservations[0],{from: userAccount});
    });
    it("Retrieve Review Successful", async () =>{
        const restaurantAccount = accounts[2];
        const userAccount = accounts[3];
        const randomAccount = accounts[0];
        // deploy restaurant
        const restaurantName = "Saizeriya";
        const instance =  await ReviewFunctionality.deployed();
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
        // post review
        const reviewContent = "i heard snails @ saizeriya are good";
        const writer = "sy";
        const postReview = await instance.postReview(reviewContent,writer,retrieveReservations[0],{from: userAccount});
        // retrieve review 
        const retrieveReview = await instance.retrieveReview(restaurantAccount,0,{from: randomAccount});
        assert.equal(retrieveReview[0], reviewContent);
        assert.equal(retrieveReview[1], writer);
    });
    it("Post Review with Invalid Reservation Hash Throws Error", async () =>{
        const restaurantAccount = accounts[4];
        const userAccount = accounts[5];
        // deploy restaurant
        const restaurantName = "Saizeriya";
        const instance =  await ReviewFunctionality.deployed();
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
        // post review
        const reviewContent = "i heard snails @ saizeriya are good";
        const writer = "sy";
        // create Invalid reservation
        const invalidReservation = "invalidReservation";
        try{
            const postReview = await instance.postReview(reviewContent,writer,invalidReservation,{from: userAccount});
            assert.fail("postReview should throw an error");
        } catch (err){
            assert.include(err.message, "INVALID_ARGUMENT", "postReview: The error message should contain 'INVALID_ARGUMENT'");
        }
    });
    it("Post Review when User's Reservation has not Visted Restaurant Throws Error", async () =>{
        const restaurantAccount = accounts[6];
        const userAccount = accounts[7];
        // deploy restaurant
        const restaurantName = "Saizeriya";
        const instance =  await ReviewFunctionality.deployed();
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
        // post review
        const reviewContent = "i heard snails @ saizeriya are good";
        const writer = "sy";
        try{
            const postReview = await instance.postReview(reviewContent,writer,retrieveReservations[0],{from: userAccount});
            assert.fail("postReview should throw an error");
        } catch (err){
            assert.include(err.message, "revert", "postReview: The error message should contain 'revert'");
        }
    });
    it("Post Review By User B When User A holds Token Throws Error", async () =>{
        const restaurantAccount = accounts[8];
        const userAccountA = accounts[9];
        const userAccountB = accounts[10];
        // deploy restaurant
        const restaurantName = "Saizeriya";
        const instance =  await ReviewFunctionality.deployed();
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
        const userCreateEvent = await instance.registerUser(userName,{from: userAccountA});
        // accept reservation by restaurant 
        const acceptReservation = await instance.acceptReservation(retrieveReservations[0],userAccountA,{from: restaurantAccount});
        // user visited restaurant
        const visitReservation = await instance.visitedRestaurant(retrieveReservations[0],userAccountA,{from: restaurantAccount});
        // post review
        const reviewContent = "i heard snails @ saizeriya are good";
        const writer = "sy";
        // initiate user
        const userName2 = "alice";
        const userCreateEvent2 = await instance.registerUser(userName2,{from: userAccountB});
        try{
            const postReview = await instance.postReview(reviewContent,writer,retrieveReservations[0],{from: userAccountB});
            assert.fail("postReview should throw an error");
        } catch (err){
            assert.include(err.message, "revert", "postReview: The error message should contain 'revert'");
        }
    });
    it("Retrieve Review for Invalid Restaurant Address Throws Error", async () =>{
        const randomAccount = accounts[11];
        const invalidRestaurantAccount = accounts[12];
        const instance =  await ReviewFunctionality.deployed();
        // retrieve review 
        try{
            const retrieveReview = await instance.retrieveReview(invalidRestaurantAccount,0,{from: randomAccount});
            assert.fail("retrieveReview should throw an error");
        } catch (err){
            assert.include(err.message, "revert", "retrieveReview: The error message should contain 'revert'");
        }
    });
    it("Retrieve Review for Negative Index Throws Error", async () =>{
        const restaurantAccount = accounts[13];
        const userAccount = accounts[14];
        const randomAccount = accounts[15];
        // deploy restaurant
        const restaurantName = "Saizeriya";
        const instance =  await ReviewFunctionality.deployed();
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
        // post review
        const reviewContent = "i heard snails @ saizeriya are good";
        const writer = "sy";
        const postReview = await instance.postReview(reviewContent,writer,retrieveReservations[0],{from: userAccount});
        // retrieve review 
        try{
            const retrieveReview = await instance.retrieveReview(restaurantAccount,-1,{from: randomAccount});
            assert.fail("retrieveReview should throw an error");
        } catch (err){
            assert.include(err.message, "INVALID_ARGUMENT", "retrieveReview: The error message should contain 'INVALID_ARGUMENT'");
        }
    });
});