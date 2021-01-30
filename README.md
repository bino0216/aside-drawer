연속적 클릭하면 콘솔이 계속 찍히는 문제 !

only javascript library.

drawer helps to make web component to android drawer aside view.

up down left right every side drawer library.

# How to Use
this is simple.
first you should to hide your aside or other view by translateX or Y.

```html
<style>
aside {
    top:0;
    left:0;
    width: 230px;
    height: 100vh;
    position: fixed;
    transform: translateX(-100%);
    background: #444;
}
</style>
<aside></aside>
```
```javascript
const drawer = new Drawer({
    element: document.querySelector('aside')
})
```


# Properties
### changeCallback
called whenever drawer's percent degree changed.
first parameter will be percent.
```javascript
{
    changeCallback: (percent) => {
        console.log(percent)
    }
}
```
and percent is 100 or 0, it means open or close.

### restoringPercentage


### allowToDirectSpread
set rull that can be control open drawer by user.
if it is false, user cant open drawer when drawer have been closed.

### openAllowPixel
it is meaningful when property allowToUser is true.
when drawer closed state, user can open the drawer within openAllowPixel degree.

# Notice
### changeCallback property guide
normally u dont need to match the delay with drawer.
because it is unnecessary considering the performance degradation.