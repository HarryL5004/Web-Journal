# Web Journal

A simple web app backed by a RESTful API service for journaling. The RESTful API is designed to be HATEOAS compliant, where subsequent actions made to a resource are discoverable through links without prior knowledge and hardcoding. This allows the API and clients of the API to grow independently with ease without being tightly coupled to the point where changes to the API would break the clients.

There are two parts to this project:

- **Journal Client**
- **Journal Service**

## Journal Client

The client application that interacts with the **Journal Service**. It provides a simple GUI to list, add, edit, and delete journals as well as pages. It also provides a simple text editor for editing pages inside a journal.

## Journal Service

The service that provides the main journaling functionality. It is exposed through a RESTful API that can be accessed without the **Journal Client**.
