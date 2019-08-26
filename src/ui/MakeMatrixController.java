package ui;

import java.io.IOException;
import java.util.Optional;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.TextField;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import model.Board;

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
    
    private Board board;
    
    private MakeMatrixResultsController mmrs;
    
    @FXML
  	public void initialize() {
  		
  		board = new Board();
      }
 
    
    public void read() {
    	try {

			int rows1 = Integer.parseInt(filasTF1.getText());
			int columns1 = Integer.parseInt(columnasTF1.getText());

			int rows2 = Integer.parseInt(filasTF2.getText());
			int columns2 = Integer.parseInt(columnasTF2.getText());

			boolean repeat = false;

			Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
			alert.initStyle(StageStyle.UTILITY);
			alert.setTitle("Confirmation Dialog");
			alert.setHeaderText("Please answer");
			alert.setContentText("Can the numbers be repeated?");

			ButtonType buttonTypeOne = new ButtonType("Yes");
			ButtonType buttonTypeTwo = new ButtonType("No");
			alert.getButtonTypes().setAll(buttonTypeOne, buttonTypeTwo);

			Optional<ButtonType> result = alert.showAndWait();
			if (result.get() == buttonTypeOne) {
				repeat = true;
			}

			board.generateMatrixRandom(rows1, columns1, rows2, columns2, repeat);
			mmrs.fillAndShowMatrix();

		} catch (NumberFormatException e) {
			Alert alert = new Alert(Alert.AlertType.WARNING);
			alert.initStyle(StageStyle.UTILITY);
			alert.setTitle("Information");
			alert.setHeaderText("WARNING!");
			alert.setContentText("Not all the information");

			alert.showAndWait();
		}
    }
    
    
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
    
   

	public TextField getFilasTF1() {
		return filasTF1;
	}

	public TextField getColumnasTF1() {
		return columnasTF1;
	}

	public TextField getFilasTF2() {
		return filasTF2;
	}

	public TextField getColumnasTF2() {
		return columnasTF2;
	}
    
    
}
