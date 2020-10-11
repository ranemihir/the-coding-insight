<p align="center">
    <img width="800" alt="The Coding Insight Logo" src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/GitVector.svg?alt=media&token=73612b13-5072-4e0e-8b0f-baea8a7c238b">
</p>

# The Coding Insight
The Coding Insight is a blogging website about technology and computer programming.

Blog articles are organised according to different topics. Users can register using Google sign in to follow these topics and checkout new content. Users can also like the blog articles and save them so that they can read them anytime later. 

## Screenshots

<table>
  <tr>
     <td>
        <img src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Fmobile%2Fhome-m.png?alt=media&token=b0a134fa-2e33-4def-ad67-0bf2fee8601a" />
    </td>
    <td>
        <img src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Fmobile%2Fhome2-m.png?alt=media&token=47f86e32-aff3-4561-9dd1-ee0505674d89" /> 
    </td>
    <td>
        <img src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Fmobile%2Fsignup-m.png?alt=media&token=cf49a701-0460-415e-84f3-412ce1d4c446"  />
    </td>
    <td>
        <img src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Fmobile%2Fprofile1-m.png?alt=media&token=b6890875-fdd4-429e-8b83-d6a5f9e11846"  />
    </td>
    <td>
        <img src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Fmobile%2Fprofile2-m.png?alt=media&token=b29e8f2a-a58c-4223-aafa-2c563414329a"  />
    </td>
  </tr>
  <tr>
    <td>
        <img src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Fmobile%2Ffeed-m.png?alt=media&token=44314792-d6d3-4c03-a16a-a39127d4171c" />
    </td>
    <td>
        <img src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Fmobile%2Ftopic-m.png?alt=media&token=f24c09bc-c095-4f02-9d6b-6f0db4d88988" /> 
    </td>
    <td>
        <img src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Fmobile%2Fblog-m.png?alt=media&token=834f7f72-e516-4162-82cc-94abc14e71a1"  />
    </td>
    <td>
        <img src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Fmobile%2Fgist-m.png?alt=media&token=e90f4940-9118-4883-8fac-112b0a1fbf06"  />
    </td>
    <td>
        <img src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Fmobile%2Flike-m.png?alt=media&token=82b3be97-ed56-4e2a-914a-4334b7a0fa48"  />
    </td>
  </tr>
</table>

## Lighthouse Performance Metrics

<p align="center">
    <img width="800" alt="Lighthouse Performance Metrics" src="https://firebasestorage.googleapis.com/v0/b/thecodinginsight.appspot.com/o/screenshots%2Flighthouse.png?alt=media&token=0e869fd9-4746-49c2-b319-13bcde16471e">
</p>

## Technical Specifications
- The website is created using [**Nuxt.js**](https://nuxtjs.org/) (a Vue.js framework for better Server-side rendering) and [**Google Firebase**](https://firebase.google.com/) (on the backend). 

- **MVVM (Model-View-ViewModel)** design pattern is used.

- A design framework called [**Vuetify**](https://vuetifyjs.com/en/) which is an implementation of Material Design Framework for Vue.js is used for frontend design.

- Instead of using the default Firebase authentication, a custom authentication system based on the Firbase documentation is implemented.

- A WYSIWYG editor called [**Editor.js**](https://editorjs.io/) is used for writing and editing post whose exclusive authorization is given to only the admin of the website.

- The app is build as a **PWA (Progressive Web App)** which basically means it could be installed natively, just like a normal app. It uses service worker for doing baclground tasks, using Indexed DB and an app manifest file which provides metadata about the app.

- **Cache Then Network** strategy is used for client side caching which means the data will first be searched in the cache (indexed DB in this scenario) and if it is not available then it will be fetched from the server by making a request and the cached version of the data is updated along the way.
