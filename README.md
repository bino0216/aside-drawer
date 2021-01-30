drawer helps to make web component like android drawer aside view.

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
const drawer = new asideDrawer({
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


### allowToDirectSpread
set rull that can be control open drawer by user.
if it is false, user cant open drawer when drawer have been closed.

### restoringPercentage
it is meaningful when property allowToDirectSpread property is true.
also you can manipulate fix percentage of drawer. its default value is 40. it mean drawer will be open only when user tug until 40% of screen of cellphone.

### openAllowPixel
it is meaningful when property allowToDirectSpread property is true.
when drawer closed state, user can open the drawer within openAllowPixel degree. in other words, it can be opened only in inner code.

# Notice
### changeCallback property guide
normally u dont need to match the delay with drawer.
because it is unnecessary considering the performance degradation.


# Demo link
[DEMO](https://bino0216.github.io/portfolio/library/aside-drawer/example/index.html)
