
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCdb2Op9bvYP17ELxg-rzmX9kgbWSfCKGk",
    authDomain: "train-simulator-c9096.firebaseapp.com",
    databaseURL: "https://train-simulator-c9096.firebaseio.com",
    projectId: "train-simulator-c9096",
    storageBucket: "train-simulator-c9096.appspot.com",
    messagingSenderId: "782515015325"
  };
  firebase.initializeApp(config);
var database = firebase.database();

var trainName;
var destination;
var initialTime;
var frequency;

$("#run-submit").click(function() {
  event.preventDefault();
  trainName = $("#TrainName").val().trim();
  console.log(trainName)
  destination = $("#Destination1").val().trim();
  initialTime = $("#TrainTime").val().trim();
  frequency = $("#Frequency1").val().trim();
  database.ref().push({
    trainName: trainName,
    destination: destination,
    initialTime: initialTime,
    frequency: frequency,
  })

  var user = {
    trainName: trainName,
    destination: destination,
    initialTime: initialTime,
    frequency: frequency,
  }

  console.log(user)
  //console.log(user)
})

function isEmptyOrSpaces(str){
    return !str || str.match(/^ *$/) !== null;
}
  database.ref().on("child_added", function(childSnapshot) {

      // Log everything that's coming out of snapshot
      console.log(childSnapshot.val());
      var trainName = childSnapshot.val().trainName;
      var destination = childSnapshot.val().destination;
      var initialTime = childSnapshot.val().initialTime;
      var frequency = childSnapshot.val().frequency;

      if(isEmptyOrSpaces(trainName)
        || isEmptyOrSpaces(destination)
        || isEmptyOrSpaces(initialTime)
        || isEmptyOrSpaces(frequency)) {
      return;
    }

      var nextArrival;
      var initialTime1 = moment().set({'hour': initialTime.split(':')[0], 'minute': initialTime.split(':')[1]});;
      console.log(initialTime1)
      function nextArrival1() {
        if (moment() > moment(initialTime1))  {
          initialTime1 = moment(initialTime1).add(frequency, 'minute');
          nextArrival1()
          console.log(initialTime1)
        } else {
          nextArrival = initialTime1;
        }
      }
      nextArrival1();
      console.log(nextArrival)
      timeLeft = moment.duration(nextArrival.diff(moment())).asMinutes()
      $("#employee-table > tbody").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + nextArrival.format('hh:mm') + "</td><td>" + Math.floor(timeLeft + 1));//moment(timeLeft).format('mm'));

    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
