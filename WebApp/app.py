'''
    Importing packages
'''
import argparse
import os
import csv
from flask import Flask, render_template, request, url_for
from seq2point_test_modified import Tester, remove_space


app = Flask(__name__)


'''
    Rendering home page
'''
@app.route("/")
def home():
    return render_template('d3_visualization.html', **locals())


@app.route("/server", methods=['POST'])
def server():
    global appliance_name

    file = request.files.get('file')

    test_directory = 'seq2point/test_mains.csv'

    parser = argparse.ArgumentParser(description="Train a pruned neural network for energy disaggregation. ")
    parser.add_argument("-f", "--fff", help="a dummy argument to fool ipython", default="1")
    parser.add_argument("--appliance_name", type=remove_space, default="microwave",
                        help="The name of the appliance to perform disaggregation with. Default is kettle. Available are: kettle, fridge, dishwasher, microwave. ")
    parser.add_argument("--batch_size", type=int, default="500",
                        help="The batch size to use when training the network. Default is 1000. ")
    parser.add_argument("--crop", type=int, default="10000",
                        help="The number of rows of the dataset to take training data from. Default is 10000. ")
    parser.add_argument("--algorithm", type=remove_space, default="seq2point",
                        help="The pruning algorithm of the model to test. Default is none. ")
    parser.add_argument("--network_type", type=remove_space, default="seq2point",
                        help="The seq2point architecture to use. Only use if you do not want to use the standard architecture. Available are: default, dropout, reduced, and reduced_dropout. ")
    parser.add_argument("--input_window_length", type=int, default="11",
                        help="Number of input data points to network. Default is 599. ")
    parser.add_argument("--test_directory", type=str, default=test_directory, help="The dir for training data. ")

    arguments = parser.parse_args()

    '''
        You need to provide the trained model (.h5 file)
    '''

    saved_model_microwave = "Please provide here the saved model path for microwave"
    saved_model_dishwasher = "Please provide here the saved model path for dishwasher"
    path = os.getcwd()

    log_file_dir = os.path.join(path,
                                arguments.appliance_name + "_" + arguments.algorithm + "_" + arguments.network_type + ".log")

    tester_microwave = Tester('microwave', arguments.algorithm, 190000,
                              arguments.batch_size, arguments.network_type,
                              arguments.test_directory, saved_model_microwave, log_file_dir,
                              11
                              )

    tester_dishwasher = Tester('dishwasher', arguments.algorithm, 190000,
                               arguments.batch_size, arguments.network_type,
                               arguments.test_directory, saved_model_dishwasher, log_file_dir,
                               199
                               )

    mains, microwave_predicted = tester_microwave.test_model()
    mains_dup, dishwasher_predicted = tester_dishwasher.test_model()

    '''
        Saving the predicted readings for microwave and dishwasher in a csv file
    '''

    csv_header = ('time', 'mains', 'microwave', 'dishwasher')

    i = 1

    with open('static/dashboard_data/results.csv', 'w') as csv_file:
        csv_writer = csv.writer(csv_file, delimiter=',', lineterminator='\n')
        csv_writer.writerow(csv_header)

        for a, h, t in zip(mains, microwave_predicted, dishwasher_predicted):
            csv_writer.writerow((i, a, h[0], t[0]))
            i += 1

    return "file saved"


if __name__ == "__main__":
    app.run(debug=True)
    # app.run()
