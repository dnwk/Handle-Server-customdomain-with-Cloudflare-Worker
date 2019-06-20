//cloudflare1.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
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
      fetch('https://hdl.handle.net/api/handles/10349' + context.request_uri, {
        method: 'GET',
        headers: {
          'User-Agent': 'cloudflare-service-worker/0.0.1'
        },
      })
    ])
  } catch (error) {
    return [ new Response("error", { status: 500 })]
  }
  //parsing json and location type URL
   data = JSON.parse(await response.text())
   for (k in data.values){
     if (data.values[k].type=='URL'){
     destinationurl=data.values[k].data.value
     }
   }

  // Send redirection response
  if(destinationurl){ 
    return Response.redirect(destinationurl, 301)
  }else{
    return new Response(s, { status: 200 })
  }
}
