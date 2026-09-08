Online Service Request Management System

1. Problem State
   Technical issues are currently communicated to the university's ICT Office via a variety of channels, including social media, text messages, and verbal requests. Some issues may be overlooked, repeated, or improperly tracked because requests are dispersed across several channels. Technical support requests can be submitted, viewed, searched, filtered, updated, and deleted by authorized users through a centralized web-based platform provided by the ICT Service Request Management System. The system will assist the ICT Office in organizing service requests, keeping track of their priority and status, and making sure that requests are appropriately documented and handled.

2. Actors
   The primary actor identified by the activity is:

Primary Actor: System User / ICT Personnel
    The actor interacts with the system to manage ICT service requests. The required activities include logging in, viewing the dashboard, creating requests, viewing requests, searching and filtering records, updating requests, deleting requests, and logging out.

Actor                 Description
System User 
/ ICT Personnel.       An authorized                         user who logs                          into the system                        and manages ICT                        service                                requests.

3. Use Case Diagram (mermaid)
   flowchart LR
    User["System User / ICT Personnel"]

    subgraph System["ICT Service Request Management System"]
        Login["Login"]
        Dashboard["View Dashboard"]
        Create["Create Request"]
        View["View Requests"]
        Search["Search Request"]
        Filter["Filter Requests"]
        Update["Update Request"]
        Delete["Delete Request"]
        Logout["Logout"]
    end

    User --> Login
    User --> Dashboard
    User --> Create
    User --> View
    User --> Search
    User --> Filter
    User --> Update
    User --> Delete
    User --> Logout


   
   
