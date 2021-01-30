(function(global, factory) {
    // UMD
    if(typeof exports === 'object' && typeof module !== 'undefined')
        module.exports = factory;
    // AMD
    else if(typeof define === 'function' && define.amd)
        define(factory);
    else
        global.drawerLayout = factory;
})(this, function asideDrawer(v = {}) {
    if(this.constructor.name != 'asideDrawer')
        return console.error('must to call by constructor');

    function setDefaultProperty(property, value) {
        v[property] = v[property] ? v[property] : value;
    }
    setDefaultProperty('speed', 12);

    // setDefaultProperty('duration', 500);

    setDefaultProperty('direction', 'left');

    // 40% 이상으로 꺼내야 서랍이 완전히 열림.
    setDefaultProperty('restoringPercentage', 40);

    // 사용자가 직접 서랍을 열 수 있나?
    setDefaultProperty('allowToDirectSpread', false);
    // 50픽셀 구석에서 터치하면 직접 서랍을 열 수 있음.
    if(v.allowToDirectSpread)
    setDefaultProperty('openAllowPixel', 50);
    // v.speed = 6;
    
    let percent = 0; //    현재 drawer가 열려있는 퍼센티지 정도. 0%면 닫혀있는 상태.
    let isOpened = false; // 현재 drawer가 열려있는 상태인가
    
    setDefaultProperty('changeCallback', () => null);

    const is_X_axis = v.direction == 'left' || v.direction == 'right';

    // 사용자가 화면을 조작중인지
    let touching = false;

    const drawPercent = (() => {
        let translate;
        if(is_X_axis) {
            const param = v.direction == 'left' ?
                        () => -(100 - percent):
                        () =>  (100 - percent);
            translate = () => `translateX(${param()}%)`;
        }
        else { // top || bottom
            const param = v.direction == 'top' ?
                        () => -(100 - percent):
                        () =>  (100 - percent);

            translate = () => `translateY(${param()}%)`;
        }


        return () => {
            if(percent > 100) {
                percent = 100;
                isOpened = true;
            }
            else if(percent < 0) {
                percent = 0;
                isOpened = false;
            }

            v.changeCallback(percent);
            
            v.element.style.transform = translate()
        }
    })();


    {
        // /* deprecated */
        // const tLoop = (show) => {
        //     v.element.style.willChange = null;
        //     v.element.style.transition = null;
        //     if(isAnimating) clearTimeout(this.isAnimating);

        //     const duration = v.duration * .001;
        //     this.isAnimating = setTimeout(() => {
        //         isAnimating = false;
        //         v.element.style.willChange = null;
        //         v.element.style.transition = null;
        //     }, duration * 1000);

        //     v.element.style.willChange = 'transform';
        //     v.element.style.transition = 
        //         'transform ' + duration + 's ' + 'cubic-bezier(0.31, 1, 0.58, 1) 0s';

        //     percent = show ? 100 : 0;
        //     drawPercent();
        //     isOpened = show;
            
        // }

        // 1 = show, 0 = hide
        let speed;
        const instance = (show) => {
            const speed = show ? v.speed : -v.speed;
            const limit = show ? 100 : 0;
            const isLimited = show ? () => (percent >= limit) : () => (percent <= limit);

            function loop() {
                if(isLimited() || touching) return;

                percent += speed;

                drawPercent();

                window.requestAnimationFrame(loop)
            }
            window.requestAnimationFrame(loop)

        }
        this.open  = () => instance(true);
        this.close = () => instance(false);
    }
    
    /**
     * drawer controlling functions
     */
    {
        let clientX, clientY;
        let deviceWidth, deviceHeight;
        let drawerWidth, drawerHeight;
        let draweredWidth, draweredHeight;
        
        const isLeftOrTop = v.direction == 'left' || v.direction == 'top';

        const getCurrentPercent = (() => {

            if(is_X_axis) {
                const exp = (X) => (drawerWidth - (drawerWidth - draweredWidth) - (clientX - X));
                
                return (e) => {
                    const X = e.touches[0].clientX.toFixed(1);
                    return (drawerWidth - (drawerWidth - draweredWidth) + (isLeftOrTop ? -1 : 1) * (clientX - X))
                    // 전체 퍼센트에서 나눔.
                    / drawerWidth * 100;
                };
            }
            else
                return (e) => {
                    const Y = e.touches[0].clientY.toFixed(1);
                    return (drawerHeight - (drawerHeight - draweredHeight) + (isLeftOrTop ? -1 : 1) * (clientY - Y))
                    // 전체 퍼센트에서 나눔.
                    / drawerHeight * 100;
                };
        })();

        const event = {
            start: (function(e) {
                touching = true;

                const PixelAxis =
                    is_X_axis ? 
                        isLeftOrTop ?
                            () => clientX < v.openAllowPixel :
                            () => clientX > deviceWidth - v.openAllowPixel
                        :
                        isLeftOrTop ?
                            () => clientY < v.openAllowPixel :
                            () => clientY > deviceHeight - v.openAllowPixel

                return (e) => {
                    if(is_X_axis) {
                        clientX = e.touches[0].clientX.toFixed(1);
                        deviceWidth = window.screen.width;
                        drawerWidth = v.element.offsetWidth;
                        draweredWidth = drawerWidth * (percent / 100);
                    }
                    else {
                        clientY = e.touches[0].clientY.toFixed(1);
                        deviceHeight = window.screen.height;
                        drawerHeight = v.element.offsetHeight;
                        draweredHeight = drawerHeight * (percent / 100);
                    }
                    
                    if(
                        (
                            !isOpened &&
                            (v.allowToDirectSpread && PixelAxis())
                        ) || isOpened
                    ) {
                        v.element.style.willChange = 'transform';
                        window.addEventListener('touchmove', event.move);
                    }
                    else
                        window.removeEventListener('touchmove', event.move);
                }
            })(),
            move: function(e) {
                this.__move = setTimeout(() => {
                    clearTimeout(this.__move);
                    percent = getCurrentPercent(e);
                    drawPercent();
                }, 16)
            },
            end: (e) => {
                touching = false;
                v.element.style.willChange = null;

                if(isOpened)
                    if(percent > (100 - v.restoringPercentage))
                        this.open();
                    else
                        this.close();
                else
                    if(percent > v.restoringPercentage)
                        this.open();
                    else
                        this.close();
            }
        };

        window.addEventListener('touchstart', event.start)
        window.addEventListener('touchend', event.end)
    }
})