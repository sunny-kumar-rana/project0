package servlets;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/me")
public class UserServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String user = (String) request.getSession().getAttribute("userEmail");

        if (user == null) {
            response.setStatus(401);
            return;
        }

        response.setContentType("application/json");
        response.getWriter().write("{\"email\":\"" + user + "\"}");
    }
}
