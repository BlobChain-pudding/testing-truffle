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
});