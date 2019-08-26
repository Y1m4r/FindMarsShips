package ui;

import java.io.IOException;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.GridPane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import model.Board;

public class MakeMatrixResultsController {

    @FXML
    private AnchorPane anchorPane;

    @FXML
    private Button goBack;
    
    @FXML
    private Button goBackCreate;
    
    @FXML
    private ScrollPane sp1;

    @FXML
    private ScrollPane sp2;

    @FXML
    private ScrollPane sp3;

    @FXML
    private Button multiply;
    
    private GridPane grid1;

	private GridPane grid2;

	private GridPane grid3;
	
    private Board board;
    
    private MakeMatrixController mmc;

	
    @FXML
	public void initialize() {
    	
    	mmc=new MakeMatrixController();
  
		grid1 = new GridPane();
		grid2 = new GridPane();
		grid3 = new GridPane();

		grid1.setGridLinesVisible(true);
		grid2.setGridLinesVisible(true);
		grid3.setGridLinesVisible(true);
		
	//	board = new Board();
		
	
    }
    
    

    @FXML
    void multiply(ActionEvent event) {
    	
    	mmc.read();
    	cleanResult();
    	
    	try {
				board.multiply(board.getBattleBoard(), board.getBattleBoard2());
				int[][] result = board.getBattleBoardFinal();

				GridPane gridX = new GridPane();
				gridX.setGridLinesVisible(true);
				grid3 = gridX;

				for (int i = 0; i < result.length; i++) {
					for (int j = 0; j < result[0].length; j++) {

						grid3.addColumn(i);
						grid3.addRow(j);

						Label lx = new Label();

						lx.setText(" " + result[i][j] + " ");
						if (board.isPrimeNumber(result[i][j]))
							lx.setTextFill(Color.DODGERBLUE);
						grid3.add(lx, j, i);

					}
				}

				sp3.setContent(grid3);
			} catch (NumberFormatException n) {
				Alert alert = new Alert(Alert.AlertType.WARNING);
				alert.initStyle(StageStyle.UTILITY);
				alert.setTitle("Information");
				alert.setHeaderText("WARNING!");
				alert.setContentText("Not all the information");

				alert.showAndWait();
			} catch (NullPointerException e) {
				Alert alert = new Alert(Alert.AlertType.WARNING);
				alert.initStyle(StageStyle.UTILITY);
				alert.setTitle("Information");
				alert.setHeaderText("WARNING!");
				alert.setContentText("Not all the information");

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

    
    @FXML
    void backToCreate(ActionEvent event) throws IOException {
    	FXMLLoader loader = new FXMLLoader(getClass().getResource("makeMatrix.fxml"));
		Parent root = loader.load();
		Scene scene = new Scene(root);
		Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
		stage.setTitle("Make Matrix");
		stage.setScene(scene);
		stage.show();
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
}
