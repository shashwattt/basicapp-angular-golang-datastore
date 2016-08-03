package firstapp

import (
	"encoding/json"
	"log"
	"net/http"
	"fmt"
    	"io/ioutil"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	
	
)
type coreData struct {
	Id 		string
	Name	string
	Num 	string 
}

type test_struct struct {
	Data coreData	
	Mode string
}

//Handle all requests
// func Handler(response http.ResponseWriter, request *http.Request){
//     response.Header().Set("Content-type", "application/json")
//     webpage, err := ioutil.ReadFile("index.html")
//     if err != nil {
//     http.Error(response, fmt.Sprintf("home.html file error %v", err), 500)
//     }
//     fmt.Fprint(response, string(webpage));
// }

// Respond to URLs of the form /generic/...
func APIHandler(response http.ResponseWriter, request *http.Request){

    //set mime type to JSON
    response.Header().Set("Content-type", "application/json")
    log.Println("In API Handler")

	err := request.ParseForm()
	if err != nil {
		http.Error(response, fmt.Sprintf("error parsing url %v", err), 500)
	}

    //can't define dynamic slice in golang
    var result = make([]string,1000)

    //making context to be used by any case
    context := appengine.NewContext(request);
    switch request.Method {
        case "GET":
        	log.Println("In GET")

        	var contactList []coreData
        	
        	q := datastore.NewQuery("Contacts");
        	_, errr := q.GetAll(context, &contactList)
        	if errr == nil{
	        	i := 0
	        	for _, val := range contactList{
	        		log.Println("Inside loop")
	        		log.Println("Name From retrieve: ", val.Name)
	        		tomarshal := &coreData{Id: val.Id,Name:val.Name, Num: val.Num}
               	 	b, err := json.Marshal(tomarshal)
                	if err != nil {
                    	fmt.Println(err)
                    return
                	}
              		result[i] = fmt.Sprintf("%s", string(b))
              		i++
	        	}
	        	result = result[:i]

	        }else{
	        	log.Println(errr)
	        }
	      



        case "POST":
           	log.Println("In POST")
           	//x := request.FormValue("mode")
           	//fmt.Println(x)
         	responsebody, _ := ioutil.ReadAll(request.Body)
    		log.Println("response Body:", string(responsebody))
    		// var jsonData = []byte(string(responsebody))

           	var dat test_struct
           	//var f interface{}
    		err := json.Unmarshal(responsebody, &dat)
    		if err == nil{
    			log.Println("Afetr unmarshal")
    			log.Println("Mode: ", dat.Mode)
    			log.Println("Name: ", dat.Data.Name)
    			
    			log.Println("In Put to datastore")
    			
				
				log.Println("context created")
				userkey := datastore.NewIncompleteKey(context, "Contacts", nil)
				log.Println("incom key created")
				entry := coreData{
					Name 	: dat.Data.Name,
					Num 	: dat.Data.Num,
				}



				_, err := datastore.Put(context, userkey, &entry)
    			if err == nil{

    				log.Println("Success!!!")
    			}else{
    				log.Println(err)
    			}

    			// err := putData(request)
    			// if err != nil{
    			// 	fmt.Println(err)
    			// }else{
    			// 	fmt.Println("Put success")
    			// }
    		}else{
    			log.Println(err)
    		}
  
        case "PUT":
           log.Println("In PUT")
        case "DELETE":
            log.Println("In DELETE")

        default:
    }
    
    json, err := json.Marshal(result)
    if err != nil {
        log.Println(err)
        return
    }

	// Send the text diagnostics to the client.
    fmt.Fprintf(response,"%v",string(json))
	
}

// func putData(request *http.Request){

// 	// responsebody, _ := ioutil.ReadAll(request.Body)
// 	// fmt.Println("response Body:", string(responsebody))
// 	// // var jsonData = []byte(string(responsebody))

//  //   	var dat test_struct
//  //   	//var f interface{}
// 	// json.Unmarshal(responsebody, &dat)

	
// 	// return err
// }
func init(){

	 // use getUserData() call before your handler
    http.HandleFunc("/", static)
    // Don't use getUserData call before your handler
    http.HandleFunc("/api/", APIHandler)


	// port := 8080
 //    var err string
	// portstring := strconv.Itoa(port)
	// //fmt.Println("Main Called")
	// mux := http.NewServeMux()
	// mux.Handle("/api/", http.HandlerFunc( APIHandler ))
	// //mux.Handle("/", http.FileServer(http.Dir("./templates/")))
	// mux.Handle("/", http.HandlerFunc( static ))

	// // Start listing on a given port with these routes on this server.
	// //log.Print("Listening on port " + portstring + " ... ")
	// errs := http.ListenAndServe(":" + portstring, mux)
	// if errs != nil {
	// 	log.Fatal("ListenAndServe error: ", err)
	// }




}

func static(w http.ResponseWriter, r *http.Request) {
	log.Println("IN Static")
    http.ServeFile(w, r, "templates/"+r.URL.Path)
}