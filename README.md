# Vitastic

## Get Start
### Back-end
The back-end of Vitastic is implemented using python's [Flask](https://flask.palletsprojects.com) framework. All 
source code reside in the `Vitastic` folder. 

It is highly recommended create a virtual environment using e.g. package manager `conda` before the further package installing:
```
conda create -n Vitastic python=3.8
```
Now you can install all python package dependencies and get the backend running by:
```
cd Vitastic
pip install -r requirements.txt
flask run
```
You should be able to see the Flask app serving the `app.py` script under [http://localhost:5000](http://localhost:5000).

Once the backend app starts serving, the `app.py` script handles the incoming requests and forward the input images to 
detection jobs written in `detection.py`. To enable the detection, you need to specify the Azure ML `REST endpoint` and
(optionally) the `authentication key` in the dotenv file. Complete the information required in the `.env_example` file 
and rename the file to `.env`.

### Front-end
The front-end was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), and all source code
can be found under the `vitastic-ui` directory. 

To start the front-end, navigate to the front-end directory, and install react dependencies by running:
```
cd vitastic-ui
yarn install
```

After installing, run the react app in development mode by:
```
yarn start
```
You can open [http://localhost:3000](http://localhost:3000) to view it in your browser.


## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
