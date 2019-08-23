package ui;

import javafx.fxml.FXML;
import javafx.scene.layout.AnchorPane;

public class MenuController {

    @FXML
    private AnchorPane anchorPane;

    @FXML
    void initialize() {
        anchorPane.setStyle("-fx-background-image: background.jpg");
    }
}
