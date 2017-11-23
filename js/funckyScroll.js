/* global _ */

function FunckyScroll() {
    var threads = [],
        scrollTop = 0,
        ticking = false
    this.init = function() {
        window.addEventListener("scroll", function(e) {
            scrollTop = window.scrollY
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    _.each(threads, function(thread) {
                        if (thread.activated) {
                            if (_.isFunction(thread.activatingCondition)
                            && !thread.activatingCondition(scrollTop)) {
                                thread.activated = false
                                //console.log('new thread deactivated')
                            } else {
                                thread.process(scrollTop)
                            }
                        } else {
                            if (_.isFunction(thread.activatingCondition)) {
                                if (thread.activatingCondition(scrollTop)) {
                                    thread.activated = true
                                    // console.log('new thread activated')
                                    thread.process(scrollTop)
                                }
                            }
                        }
                    })
                    ticking = false
                })
            }
            ticking = true
        })
    }
    this.addThread = function(thread) {
        threads.push(thread)
    }
    this.addThreads = function(newThreads) {
        _.each(newThreads, this.addThread, this)
    }
    this.addSingleListenerThread = function(listener) {
        var thread = new FunckyScrollThread()
        thread.addEventListener(listener)
        this.addThread(thread)
    }
}

function FunckyScrollThread(properties = {}) {
    if (properties.activationThreashold) {
        this.activationThreashold = properties.activationThreashold
        this.activatingCondition = function(scrollTop){
            return scrollTop >= properties.activationThreashold
        }
        this.activated = false
    } else {
        this.activated = true
    }
    this.eventListeners = []
    this.currentlyListeningListener = undefined
}

FunckyScrollThread.prototype.addEventListener = function(listener) {
    listener.index = this.eventListeners.length
    if (!listener.notUsingRelativeScrollTop) {
        listener.setUpRelativeScrollTop(this.eventListeners, this.activationThreashold)
    }
    this.eventListeners.push(listener)
}
FunckyScrollThread.prototype.addEventListeners = function(listeners) {
    _.each(listeners, this.addEventListener, this)
}
FunckyScrollThread.prototype.process = function(scrollTop) {

    this.reactivateDeactivatedListener(scrollTop)

    var firstActivatedListener = _.find(this.eventListeners, function(l) {
        return l.activated
    })

    this.replaceCurrentlyListeningListener(firstActivatedListener)

    if (this.currentlyListeningListener !== undefined) {
        this.currentlyListeningListener.listen(scrollTop)
    }

}

FunckyScrollThread.prototype.reactivateDeactivatedListener = function(scrollTop) {
    var deactivatedListeners = _.filter(this.eventListeners, function(l) {
        return !l.activated
    })
    _.each(deactivatedListeners, function(listener) {
        if (_.isFunction(listener.reactivatingCondition)) {
            if (listener.reactivatingCondition(scrollTop)) {
                listener.activate()
            }
        } else {
            if (!listener.deactivatingCondition(listener.computeData(scrollTop))) {
                listener.activate()
            }
        }
    })
}

FunckyScrollThread.prototype.replaceCurrentlyListeningListener = function(newListener) {

    // More performance-efficent code here:
    //
    //
    // if (this.currentlyListeningListener != newListener) {
    //     if (this.currentlyListeningListener !== undefined && newListener !== undefined) {
    //         if (newListener.index < this.currentlyListeningListener.index) {
    //             if (_.isFunction(this.currentlyListeningListener.reset)) {
    //                 this.currentlyListeningListener.reset()
    //             }
    //         }
    //     }
    //     this.currentlyListeningListener = newListener
    // }
    //

    if (this.currentlyListeningListener != newListener) {
        this.currentlyListeningListener = newListener
        if (this.currentlyListeningListener !== undefined) {
            _.each(this.eventListeners, function(listener) {
                if (listener.index > this.currentlyListeningListener.index)
                    if (_.isFunction(listener.reset)) {
                        listener.reset()
                    }
            }, this)
        }
    }

}

function FunckyScrollEventListener(properties) {

    if (properties.notUsingRelativeScrollTop) {
        this.computeData = properties.computeData
        this.reactivatingCondition = properties.reactivatingCondition
    } else {
        this.computeData = function(scrollTop) {
            return properties.computeData(scrollTop - this.startingScrollTop)
        }
        if (properties.reactivatingCondition !== undefined) {
            this.reactivatingCondition = function(scrollTop) {
                return _.bind(properties.reactivatingCondition, this)(scrollTop - this.startingScrollTop)
            }
        }
    }

    this.notUsingRelativeScrollTop = properties.notUsingRelativeScrollTop
    this.activated = true
    this.sideEffect = properties.sideEffect
    this.deactivatingCondition = properties.deactivatingCondition
    this.willDeactivate = properties.willDeactivate
    this.willActivate = properties.willActivate
    this.reset = properties.reset
    if (_.isFunction(properties.computeConstants)) {
        _.bind(properties.computeConstants, this)()
    }
    if (_.isFunction(properties.hOE)) {
        this.hOE = properties.hOE()
    }else{
        this.hOE = properties.hOE
    }
}

FunckyScrollEventListener.prototype.setUpRelativeScrollTop = function(previousListeners, start = 0){
    this.startingScrollTop = _.reduce(previousListeners, function(a,b){return a + b.hOE}, 0) + start
}

FunckyScrollEventListener.prototype.listen = function(scrollTop) {
    var data = this.computeData(scrollTop)
    if (this.deactivatingCondition(data)) {
        if (_.isFunction(this.willDeactivate)) {
            this.willDeactivate()
        }
        this.activated = false
    } else {
        this.sideEffect(data)
    }
}

FunckyScrollEventListener.prototype.activate = function(){
    if (_.isFunction(this.willActivate)) {
        this.willActivate()
    }
    this.activated = true
}


FSFadeInEventListener.prototype = FunckyScrollEventListener.prototype
FSFadeInEventListener.prototype.constructor = FSFadeInEventListener

function FSFadeInEventListener(properties) {

    var doms = _.isArray(properties.dom) ? properties.dom : [properties.dom]

    FunckyScrollEventListener.call(this, {
        hOE : properties.hOE,
        deactivatingCondition : function(data){ return data.alpha >= 1 },
        computeData: function(scrollTop){ return {alpha : (scrollTop /this.hOE) }},
        sideEffect: function(data){
            _.each(doms, function(d){ d.css("opacity", data.alpha) })
        },
        willDeactivate: function(){
            this.sideEffect({alpha: 1})
            if(properties.willDeactivate){
              properties.willDeactivate()
            }
        },
        reset: function(){
            this.sideEffect({alpha: 0})
        },
        willActivate: function(){
          if(properties.willActivate){
            properties.willActivate()
          }
        }
    })
}

FSFadeOutEventListener.prototype = FSFadeInEventListener.prototype
FSFadeOutEventListener.prototype.constructor = FSFadeOutEventListener

function FSFadeOutEventListener(properties) {

    var doms = _.isArray(properties.dom) ? properties.dom : [properties.dom]

    FunckyScrollEventListener.call(this, {
        hOE : properties.hOE,
        deactivatingCondition : function(data){ return data.alpha <= 0 },
        computeData: function(scrollTop){ return {alpha : 1 - (scrollTop /this.hOE) }},
        sideEffect: function(data){
            _.each(doms, function(d){ d.css("opacity", data.alpha) })
        },
        willDeactivate: function(){
            this.sideEffect({alpha: 0})
        },
        reset: function(){
            this.sideEffect({alpha: 1})
        }
    })
}
