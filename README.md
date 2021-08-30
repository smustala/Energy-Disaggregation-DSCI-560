# DSCI 560 - Machine Learning Models for Energy Disaggregation
## The Pythonpuff Girls

## Members:
<br>Patricia Ferido
<br>Shalini Mustala
<br>Monal Patil
<br>Yiming Wang

## Introduction:

The objective of this project is to build two machine learning models for separating total electric energy usage of two appliances from the aggregate house energy consumption data. We trained and tested both models on low rate sampling data, discussed strengths and weaknesses, and compared the results with the industry benchmark (Factorial Hidden Markov Model). Finally, we built a dashboard that enables energy companies to visualize the disaggregated appliance energy consumption. 

The machine learning models used this work are:
Seq-to-point CNN
Window GRU
Factorial Hidden Markov Model (As a baseline)

## Data Gathering:
The data used for this project is from the REDD dataset. Please find the raw data at http://redd.csail.mit.edu. The data contains power consumption from real homes, for the whole house as well as for each individual circuit in the house (labeled by the main type of appliance on that circuit). A detailed description about the dataset can be found at http://redd.csail.mit.edu/readme.txt. 


For an overview of the data collection procedures and a description of algorithms see:
J. Zico Kolter and Matthew J. Johnson.  REDD: A public data set for energy disaggregation research.  In proceedings of the SustKDD workshop on Data Mining Applications in Sustainability, 2011

## Seq2Point

**Data Preprocessing**
Resampling the data and align the mains and appliance readings to 1/8 Hz (aggregation method used: mean), backfilling of missing values, mean normalization of data. 
The folder “Energy-Disaggregation/transferNILM-master/dataset_management/redd/” has the code for data preprocessing done for the seq2point model. The main program to run is ‘create_trainset_redd.py’ with arguments for appliance (appliance_name), data directory (data_dir), aggregate mean and std (aggregate_mean, aggregate_std) and save directory (save_path). Default parameters can be found in ‘redd_parameters.py’ and relied upon by the above program. By default, the program will use houses 2 and 3 for training and allows for training of dishwasher, microwave, fridge, and washing machine. Additional python scripts have been included that create training data for additional houses and for kitchen outlets and stove. These have been named accordingly with descriptive suffixes.

The preprocessed data can be found in the folder “**training data**” 

**Hyperparameter Optimization**

The folder “**Tuning_Notebooks**” has notebooks for hyperparameter tuning for the appliances we tuned on: Dishwasher, microwave, stove and kitchen outlet.

A common notebook named "Seq2point_tuning-Common" can be used as a common notebook to tune on any appliance with any training data. 

Parameters tuned: Batch size, window length, window offset, epochs and learning rate
Best Model for Microwave: 
Train on House 2 & 3, Test on House 1
Window Size: 11;  Epochs: 2; Batch Size: 1000
Best Model for Dishwasher: 
Train on House 2 & 3, Test on House 1
Window Size: 199; Epochs: 5;  Batch Size: 500
ML library: keras
Estimated efforts to tune hyperparameters on new appliances: 7.5-9 hours on Google Colab Tesla T4 GPU 

**Training and Testing** :

The folder “**Training_Notebooks**” has notebooks for training and testing of appliances we trained on: Dishwasher, microwave, stove and kitchen outlet.
A common notebook named "Seq2point-Common" can be used as a common notebook to train and test on any appliance with any training data.

Training: House 2 and 3
Validation: 10% of the training data
Testing: House 1
Training time for each appliance: around 10 minutes (Google Colab Nvidia Tesla T4 GPU) 


**Pretrained models:**

The folder “**pretrained_models**'' contains the scripts needed to run the seq2point testing using saved pretrained models. These scripts are used in the dashboard backend to show the disaggregated results of mains data from any house inputted into the dashboard. 

Since the size of the saved models is too big for github, we uploaded the saved models for dishwasher and microwave to figshare. Go to figshare and type these DOIs in the search: 
Dishwasher: 10.6084/m9.figshare.14481717
Microwave: 10.6084/m9.figshare.14481705

Instructions for using the saved model for dashboard:
Please run seq2point_test_modified.py to test on the trained model. 

Variables to take into account while running this script:
Path for the saved model for the appliance
Path for the test data 
Batch_size: 500 for both the appliances (already plugged into the code)
Input_window_length: 11 for microwave, 199 for dishwasher (already plugged into the code)

Sample test set in the folder “mains_data” is for house 1 in REDD data.  
Output: time, mains data, predicted microwave, predicted dishwasher as csv

## Window GRU:

**Data Preprocessing:**
Combined the main1 and main2 readings in the REDD dataset,
Normalize the data by dividing with the max value of mains reading, 
Sampling rate used: 1 Hz 

Dataset available for download at: 10.6084/m9.figshare.14482896
Data preprocessing is done during the training and testing phase itself.

**Training and Testing :**

The folder “**Training_Notebooks**” has notebooks for hyperparameter tuning,  training and testing of appliances we tuned on: Dishwasher, microwave, stove and kitchen outlet.

Parameters tuned: Batch size, window length, window offset, epochs and learning rate
Best Model for Microwave: 
Train on House 2 & 3, Test on House 1
Window Size: 10;  Epochs: 20; Batch Size: 128
Best Model for Dishwasher: 
Train on House 2 & 3, Test on House 1
Window Size: 50; Epochs: 15;  Batch Size: 512
ML library: keras
Estimated efforts to tune hyperparameters on new appliances: 7-8  hours on Google Colab Tesla T4 GPU

**Pretrained model :**

The folder “**pretrained_models**'' contains the scripts needed to run the windowGRU testing using saved pretrained models. 
Since the size of the saved models is too big for github, we uploaded the saved models for dishwasher and microwave to figshare. Go to figshare and type these DOIs in the search: 
Dishwasher: 10.6084/m9.figshare.14531589
Microwave: 10.6084/m9.figshare.14531607


**Dashboard:**
The folder  “**WebApp**” folder contains Dashboard code 

**How to run the dashboard?** 
Open the terminal
Navigate to the WebApp folder
 Execute flask run 
Open the http://127.0.0.1:5000/ in the browser
Upload the CSV file with mains reading in the WebApp running on browser
The model will load online and perform testing on the uploaded mains reading
The disaggregated energy reading visualization will be presented in the webapp

**Factorial Hidden Markov Model**
The file ‘FHMM for 2 appliances.ipynb’ contains the code to run the FHMM model. Users will need to install the NILMTK package before running the code. The instructions to install the package can be found at https://github.com/nilmtk/nilmtk/blob/master/docs/manual/user_guide/install_user.md. 




