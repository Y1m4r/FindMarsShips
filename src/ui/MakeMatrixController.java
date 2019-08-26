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
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TextField;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.GridPane;
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
    private ScrollPane sp1;

    @FXML
    private ScrollPane sp2;

    @FXML
    private ScrollPane sp3;
    
    @FXML
    private Button goBack;
    
    private Board board;
   
	private GridPane grid1;

	private GridPane grid2;

	private GridPane grid3;
	
    
    @FXML
	public void initialize() {

		board = new Board();
		
		grid1 = new GridPane();
		grid2 = new GridPane();
		grid3 = new GridPane();

		grid1.setGridLinesVisible(true);
		grid2.setGridLinesVisible(true);
		grid3.setGridLinesVisible(true);

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
		
    //	cleanResult();
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

			ButtonType buttonTypeOne = new ButtonType("YES");
			ButtonType buttonTypeTwo = new ButtonType("NO");
			alert.getButtonTypes().setAll(buttonTypeOne, buttonTypeTwo);

			Optional<ButtonType> result = alert.showAndWait();
			if (result.get() == buttonTypeOne) {
				repeat = true;
			}

			board.generateMatrixRandom(rows1, columns1, rows2, columns2, repeat);
			fillAndShowMatrix();

		} catch (NumberFormatException e) {
			Alert alert = new Alert(Alert.AlertType.WARNING);
			alert.initStyle(StageStyle.UTILITY);
			alert.setTitle("Information");
			alert.setHeaderText("WARNING!");
			alert.setContentText("Please proveide all of the information required to generate the matrix");

			alert.showAndWait();
		}
    	
    	
    }
    
    
    public void fillAndShowMatrix() {

		int[][] battleBoard = board.getBattleBoard();
		int[][] battleBoard2 = board.getBattleBoard2();

		GridPane gridX = new GridPane();
		GridPane gridY = new GridPane();
		gridX.setGridLinesVisible(true);
		gridY.setGridLinesVisible(true);
		grid1 = gridX;
		grid2 = gridY;

		for (int i = 0; i < battleBoard.length; i++) {
			for (int j = 0; j < battleBoard[0].length; j++) {

				grid1.addColumn(i);
				grid1.addRow(j);

				Label lx = new Label();

				lx.setText(" " + battleBoard[i][j] + " ");

				grid1.add(lx, j, i);

			}
		}

		for (int i = 0; i < battleBoard2.length; i++) {
			for (int j = 0; j < battleBoard2[0].length; j++) {

				grid2.addColumn(i);
				grid2.addRow(j);

				Label lx = new Label();

				lx.setText(" " + battleBoard2[i][j] + " ");

				grid2.add(lx, j, i);

			}
		}

		sp1.setContent(grid1);
		sp2.setContent(grid2);

	}
    
    public void cleanResult() {

		GridPane gridX = new GridPane();
		sp3.setContent(gridX);

	}
	
	public void cleanMatrices() {

		GridPane gridX = new GridPane();
		sp1.setContent(gridX);
		sp2.setContent(gridX);

	}

}
