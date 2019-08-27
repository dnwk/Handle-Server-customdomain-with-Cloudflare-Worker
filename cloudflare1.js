//cloudflare1.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  //config your handle prefix, if you do not intent to use it in your custom domain. 
  //e.g. With prefix  xxx.edu/prefix/handle
  // without prefix   xxx.edu/handle
  // leave prefix empty if the permanent URL you use aleady includes prefix
  const prefix = "10349"
  const urlObject = new URL(request.url)
  const context = {
    host: urlObject.host,
    request_uri: urlObject.pathname,
    use_json: true,
  }
 //fetching response via API
 let response
  try {
    response = await Promise.race([
      fetch('https://hdl.handle.net/api/handles/' + prefix + context.request_uri, {
        method: 'GET',
        headers: {
          'User-Agent': 'cloudflare-service-worker/0.0.1'
        },
      })
    ])
  } catch (error) {
    return [ new Response("500/Handle Server error", { status: 500 })]
  }
  //parsing json and location type URL
   data = JSON.parse(await response.text())
   for (k in data.values){
     if (data.values[k].type=='URL'){
     var destinationurl=data.values[k].data.value
     }
   }

  // Send redirection response
  if(destinationurl){ 
    return Response.redirect(destinationurl.trim(), 301)
  }else{
    return new Response("404/Handle Not Found", { status: 404 })
  }
}
