package ui;

import java.io.IOException;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Stage;

public class MakeMatrixController {

    @FXML
    private AnchorPane anchorPane;

    @FXML
    private TextField filasTF1;

    @FXML
    private TextField columnasTF1;

    @FXML
    private TextField filasTF2;

    @FXML
    private TextField columnasTF2;

    @FXML
    private Button resultsButton;
    
    @FXML
    private Button goBack;
    
    @FXML
    void backToMenu(ActionEvent event) throws IOException {
    	FXMLLoader loader = new FXMLLoader(getClass().getResource("menu.fxml"));
		Parent root = loader.load();
		Scene scene = new Scene(root);
		Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
		stage.setTitle("Menu");
		stage.setScene(scene);
		stage.show();
    }

    @FXML
    void showResults(ActionEvent event) throws IOException {
    	FXMLLoader loader = new FXMLLoader(getClass().getResource("makeMatrixResults.fxml"));
		Parent root = loader.load();
		Scene scene = new Scene(root);
		Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
		stage.setTitle("Make your Matrix");
		stage.setScene(scene);
		stage.show();
    }

}
