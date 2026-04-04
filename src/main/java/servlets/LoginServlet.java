package servlets;

import DBConnectivity.DBConnection;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.stream.Collectors;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json");

        BufferedReader reader = request.getReader();
        String body = reader.lines().collect(Collectors.joining());

        JSONObject json = new JSONObject(body);

        String email = json.getString("email");
        String password = json.getString("password");

        if (email == null || password == null) {
            response.setStatus(400);
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {

            PreparedStatement ps = conn.prepareStatement(
                    "SELECT role FROM users WHERE email=? AND password=?"
            );

            ps.setString(1, email);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                request.getSession().setAttribute("userEmail", email);
                request.getSession().setAttribute("role", rs.getString("role"));
                response.setStatus(200);
            } else {
                response.setStatus(401);
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
        }
    }
}
