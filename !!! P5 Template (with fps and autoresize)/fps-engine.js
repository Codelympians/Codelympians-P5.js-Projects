let fpsEngine = {
    frameTimes: [], // Time recordings corresponding to each frame
    oldTime: 0, // Time at which the previous frame is updated
    fpsCooldown: 0, // When fpsCooldown <= 0, set displayFPS = fps
    displayFPS: 0, // fps displayed on screen, updated every second
    realFPS: 0,
    
    // Functions related to FPS
    // Usage: insert them at the end of the draw() function
    updateFPS: function() {
        let currentTime = millis()
        this.frameTimes.push(currentTime)
        while (this.frameTimes.length > 0 && this.frameTimes[0] < currentTime - 1000) {
            this.frameTimes.splice(0, 1)
        }

        // Calculate fpsDelta
        let fpsDelta = currentTime - this.oldTime

        // Update realFPS
        this.realFPS = this.frameTimes.length
        if (millis() < 1000) {
            this.realFPS = Math.round(1000 / fpsDelta)
        }
        
        // Update displayFPS
        this.fpsCooldown -= fpsDelta
        if (this.fpsCooldown <= 0) {
            this.displayFPS = this.realFPS
            this.fpsCooldown = 1000
        }

        this.oldTime = currentTime
    },
    showFPS: function(r, g, b) {
        fill(r, g, b)
        textAlign(RIGHT, TOP) // Text alignment of the fps label
        textSize(24)
        text(`${Math.floor(this.displayFPS)} fps`, width - 16, 16) // Position of the fps label
    }
}