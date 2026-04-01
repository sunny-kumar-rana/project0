package servlets;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.stream.Collectors;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        BufferedReader reader = request.getReader();
        String body = reader.lines().collect(Collectors.joining());

        JSONObject json = new JSONObject(body);

        String email = json.getString("email");
        String password = json.getString("password");

        if (email.equals("test@mail.com") && password.equals("1234")) {
            request.getSession().setAttribute("userEmail", email);
            response.setStatus(200);
        } else {
            response.setStatus(401);
        }
    }
}
