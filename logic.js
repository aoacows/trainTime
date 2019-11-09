var firebaseConfig = {
  apiKey: "AIzaSyAqfRgno6lpcmYvWVMcItn3dZjmpU18eBU",
  authDomain: "traintime-2c47c.firebaseapp.com",
  databaseURL: "https://traintime-2c47c.firebaseio.com",
  projectId: "traintime-2c47c",
  storageBucket: "traintime-2c47c.appspot.com",
  messagingSenderId: "125155314710",
  appId: "1:125155314710:web:e6608d65620ca9b50e7937",
  measurementId: "G-NL4JNYLC42"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var database = firebase.database();

var currentTime = moment().format();

console.log("Current Time: " + currentTime);

const newLocal = "#submitBtn";
$(newLocal).on("click", function () {
  event.preventDefault();

  var podName = $("#podName").val().trim();
  var destination = $("#destination").val().trim();
  var podTimes = moment($("#podTimes").val().trim(), "HH:mm").format("HH:mm");
  var frequency = $("#frequency").val().trim();

  var newPod = {
    pod: podName,
    destination: destination,
    first: podTimes,
    frequency: frequency
  };
  database.ref().push(newPod);

  console.log(newPod.pod);
  console.log(newPod.destination);
  console.log(newPod.first);
  console.log(newPod.frequency);

  $("#podName").val("");
  $("#destination").val("");
  $("#podTimes").val("");
  $("#frequency").val("");
});

database.ref().on("child_added", function (childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  var podName = childSnapshot.val().pod;
  var podDestination = childSnapshot.val().destination;
  var podTime = childSnapshot.val().first;
  var podFrequency = childSnapshot.val().frequency;

  var podTimeConverted = moment(podTime, "HH:mm");

  var timeDifference = moment().diff(moment(podTimeConverted), "minutes");
  console.log(timeDifference);

  var frequencyMinutes = childSnapshot.val().frequency;
  console.log("Frequency Minutes: " + frequencyMinutes);

  var minutesAway = Math.abs(timeDifference % frequencyMinutes);
  console.log("Minutes Away: " + minutesAway);

  var nextArrival = moment(currentTime).add(minutesAway, "minutes").format("hh:mm A");
  console.log("Next Arrival: " + nextArrival);


  $("#podTable > tbody").append("<tr><td>" + podName + "</td><td>" + podDestination + "</td><td>" + podFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});