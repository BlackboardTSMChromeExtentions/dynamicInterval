/*
 V1.0 2021-02-06 Inital Creation
*/

class dynamicInterval{
	constructor( processFunc=null, optionsObject, criteriaFunc ){
		if( !processFunc  ){ 
			console.error("ERROR: No function was set for dynamicInterval.")
			return null
		}
		
		const { delay, max, ms } = optionsObject?? {}
		
		this.interval=null // Actual "interval" variable to set/clear
		this.count=0
		this.paused=false 
		this.ended=false // For status reporting purposes

		this.delay=delay?? false // Else 1 cycle passes before starting
		this.max= max?? 0	// # Cycles until Interval auto-clears
			/// 0 = Infinite ( ex: using other clearing critera ) 

		this.ms= ms?? 1000	// Milliseconds between cycles

		this.isCountMaxed = () => ( this.max && this.count >= this.max )

		this.processFunc  = processFunc 	// Function to be carried out  
		this.criteriaFunc = criteriaFunc?? this.isCountMaxed 
			// Logic Function for clearing the Interval 
				
		if(this.processFunc)(
			this.start() // can auto-initalize!!! :-)
		)
	}

	increment(){
		this.count++
	}

	getStatus(){
		const { canceled, count, paused, max, ms  } = this
		return ({ canceled, count, paused, max, ms  })
	}
	
	cycle(){
		if(this.criteriaFunc()){
			this.stop()
		} else if ( !this.paused ) {
			this.processFunc(this.count)
			this.increment()
		}
	}

	start(){		
		if ( this.count === 0 ){ 			
			// Set up repeating interval
			this.interval = setInterval( ()=>{ 
				this.cycle()
			}, this.ms)	
		
				// Bypass inital delay unless delay is requested
			if(!this.delay){
				this.cycle()
			}
		}
	}
		
	stop(){ // that way we can also externally halt the execution
		clearInterval( this.interval )
		this.ended = true
	}
	
	pause(){
		this.paused = true
	}

	resume(){
		this.paused = false
	}
		
	toggle(){
		const { paused } = this.getStatus()
		if(paused){
			this.resume()
		} else {
			this.pause()
		}
		return paused
	}
	
	restart( resetCount = true, forceResume = true ){
		this.stop() 
		if(resetCount){
			this.count = 0
		}
		if(forceResume){
			this.resume()
		}
		this.ended = false // revert change from this.ended		
		this.start()
	
	}
	
	changeSpeed( ms = 1000, resetCount = false , forceResume=false ){
		// !! Unpause and recounts not automatic for changeSpeed
			/// Also no effect on external critera
		this.ms = ms
		if(resetCount){ this.resume() }  // need to handle this first or external 
		
		// Need to restart for new speed to take effect
		if( !this.criteriaFunc() ){
			this.restart(resetCount, forceResume )
		}
	}
}