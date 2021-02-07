# dynamicInterval
Enhance JavaScript's setInterval functionality to allow for a range of scenarios:

Markup : * Set criteria to have the inteval clear itself   
			* Built-in option to auto-clear interval after [n] cycles
			* Or pass an external critera function of your own
		
		* Includes methods to easily Stop/Pause/Resume/Restart the interval without having to manually recreate it
		 	* Pause/Resume specifically even include a "Toggle" function to handle the if/then case for you

		 * Adjust the speed of the interval by changing the number of miliseconds between cycles
		 	* NOTE: This technically clears the interval and creates a new one, but this script handles it for you

		* Bypass the inital delay before the interval starts

		* Check status information regarding the interval for use in external scripts 

## Installation
Link the dynamicInterval.js file in your HTML with a script tag
```HTML
<script src="dynamicInterval.js"></script>
```

## Usage
```javascript
cont foo = new dynamicInterval( processFunc, optionsObject, criteriaFunc )
	// The interval will automatically initiate
	// Only processFunc is manditory 
```
## processFunc ( required )
The processFunc parameter accepts a Function (either annoymous or named) as it's argument. This function will subsequently be invoked on a regular, timed, basis until the Interval is cleared or the pause() Method is invoked. 

Typically, processFunc is a wrapper for other Functions since dynamicInterval does not support the direct passing of arguments to the process function ( with the noteable exception of the current cycle count). 
Instead, the processFunc should generally read/write external variables. Likewise, the process function should not directly return any values to dynamicInterval as they will be ignored. 


Examples:
 ```javascript
let foo = 0

const bar = () => {
	foo++
	return foo
}

const baz = new dynamicInterval(()=> {
	const n = bar()
	console.log(n)
})
// <cycle 1> foo is incremented to 1 and then logged to the console
// <cycle 2> foo is incremented to 2 and then logged to the console
// ... etc 

const qux = () => {
	console.log( bar() )
}

const quux = new dynamicInterval( qux ) 
// Same result as above
// NOTE: When qux is passed as an argument, it is NOT followed by paranthesis. 
// This is because the function, rather than it's invocation is  parameter  


const corge = new dynamicInterval((c) => {
	console.log(c + 2)
})
// <cycle 1> the number 2 is logged
// <cycle 2> the number 3 is logged
// ...etc 
// NOTE: The cycle count starts at 0 and auto-increments 
 ```

## optionsObject ( optional )
The optionsObject parameter accepts null or an Object as its argument. If an Object is received it may contain any/all of the following attributes:

Markup : * delay - Accepts a Boolean which controls whether or not to wait before executing the first cycle as would occur with the vanilla setInterval method
			* false = skips the delay and executes immediatly; true = wait before executing the first cycle
			* Defaults to false 

		* max - Accepts a Number which is 0 or higher as a limit on how many cycles to process
			* NOTE: This value will only be considered if a criteraFunction was not passed during instantiation
			* A max of 0 is treated as Unlimited
			* The cycle count is base 0 but and is compared to max using "greater than or eaqual to" prior to executing the next cycle. 
				* Thus a max of 5 would execute 5x but with count values of 0-4     
			* Decimals can be accepted, but would treat the number as being rounded up
			* Defaults to 0

		
		* ms -  Accepts a Number of 0 or higher as the amount of milliseconds between cycles 
			* Defaults to 1000
			* After the Interval is instantiated, direct changes to the ms value have no effect; the dynamicInterval has a designated Method to handle such changes 

NOTE: Ommited attributes revert to their defaults while extra attributes are ignored.

Examples:
 ```javascript
const grault = { ms: 200, max: 50, delay: true }
// After an inital delay of 0.2 seconds, the processFunc would be called 5x/second for a total of 10 seconds  
````

## criteriaFunc (optional)
The criteriaFunc parameter accepts null or a Function (either annoymous or named) as it's argument. If a Function is received, it should ultimatly pass a boolean as it's return value. Specifically the logic in the criteriaFunc should evaluate whether the ongoing Interval should be cleared with true initiating a stop and false continuing the process. Typically criteriaFunc will have access to read external variables as dynamicInterval does not pass any arguments directly to it.

```javascript
// Assuming qux ( and by extention foo and bar ) from the earlier examples above 
const timestamp = new Date()

const garply = () => {
	return ( new Date() - timestamp ) > 3000
}

const waldo = new dynamicInterval( qux , null , garply )
// The processFunc would be called until 3 or more seconds had passed since "timestamp" had been declared.  
```
## Author
Jon Spencer (2021)