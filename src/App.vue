<template>
  <div>
    <router-view />
  </div>
</template>

<script>
  export default{
    name:'app'
  }
</script>

<style>
*{
  margin:0;
  padding: 0;
}
div{
  box-sizing: border-box;
}
li,ul{
  list-style: none;
}
input,button{
  outline:none;
  border:0;
}
@font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url(/static/font/lpl.woff2) format('woff2');
  }

  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
</style>

