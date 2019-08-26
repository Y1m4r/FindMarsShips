package model;

public class Board {

	private int battleBoard[][];
	private int battleBoard2[][];
	private int battleBoardFinal[][];
	
	

	public Board(int[][] battleBoard, int[][] battleBoard2, int[][] battleBoardFinal) {
		this.battleBoard = battleBoard;
		this.battleBoard2 = battleBoard2;
		this.battleBoardFinal = battleBoardFinal;
	}

	public int[][] getBattleBoard() {
		return battleBoard;
	}

	public int[][] getBattleBoard2() {
		return battleBoard2;
	}

	public int[][] getBattleBoardFinal() {
		return battleBoardFinal;
	}
	
	public void generateMatrixRandom(double row, double column, double row2, double column2, boolean isEnemy) {
		
	}
	
	public boolean isPrimeNumber(int x) {
		
		return false;
	}
	
	public int[][] multiply(int[][] a, int[][] b){
		
		return null;
	}
	
	public int[][] sub(int[][] a, int[][] b){
		
		return null;
	}
	
	public int[][] add(int[][] a, int[][] b){
		
		return null;
	}
	
	public void split(int[][] p, int[][] c, int[][] iB, int[][] jB){
		
	}
	
	public void join(int[][] p, int[][] c, int[][] iB, int[][] jB){
		
	}
	
}
