// a trivial example to illustrate Promise in Javascript
function myDisplayer(some) {
  console.log(some);
}

let myPromise = new Promise(function (myResolve, myReject) {
  let x = 0;

  if (x == 0) {
    myResolve("OK");
  } else {
    myReject("Error");
  }
});

myPromise.then(
  function (value) {
    myDisplayer(value);
  },
  function (error) {
    myDisplayer(error);
  }
);

// about async function
async function myDisplay() {
  let myPromise = new Promise(function (resolve) {
    setTimeout(function () {
      resolve("I love You !!");
    }, 3000);
  });

  console.log(await myPromise);
}

myDisplay();
