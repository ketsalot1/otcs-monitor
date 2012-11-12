package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.FileReader;

import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

//import javax.el.ValueExpression;
import javax.faces.context.FacesContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpSession;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
import common.utils.FacesUtil;
import jsfks.PersonBean;
import jsfks.PersistentContainer;
*/

public class senchaTouchServlet extends HttpServlet {

	/**
	 * Constructor of the object.
	 */
	public senchaTouchServlet() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	// Actions -----------------------------------------------------------------------------------

	public void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		this.doSomething(request, response);
	}


	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		this.doSomething(request, response);
	}

	// Actions -----------------------------------------------------------------------------------

	private void doSomething(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {

		String file = request.getParameter("otcs");
		String data02 = request.getParameter("data02");
		String cb = request.getParameter("processSupportData");

		int cont = -1;

		PrintWriter out = response.getWriter();
		out.print(cb + "(");

		FileReader reader = new FileReader("/tmp/" + file + ".data");

		while((cont = reader.read()) != -1 ) {
			out.write(cont);
		}
		reader.close();
		out.print(")");

//		request.setAttribute("data01", data01 );
//		request.setAttribute("data02", data02 );

		//get the request dispatcher
		// RequestDispatcher dispatcher = getServletContext().getRequestDispatcher("/pages/senchaTouchOut.jsp");
		
		//forward to the jsp file to display the book list
		// dispatcher.forward(request, response);		
	}

	/**
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException if an error occure
	 */
	public void init() throws ServletException {
		// Put your code here
	}

	
	/** Evaluate and return the given value binding expression
	* @param context The FacesContext for this web app
	* @param expr The value binding expression to be evaluated, such as "Sum is #{foo.sum}"
	* @return The value of the expression
	*/
	private Object getValue(FacesContext context, String expr) {
		return getValue(context, expr, expr.getClass());
	}
	

	protected Object getValue(FacesContext context, String expr, Class c) {
//		ValueExpression ve = context.getApplication().getExpressionFactory().createValueExpression( context.getELContext(), expr, c);
	
//		if (ve != null) {
//			return ve.getValue(context.getELContext());
//		}	
	
		return null;
	}
	

}
